/**
 * Original Author: Spencer Evans evans.spencer\@gmail.com
 *
 * unmute is a disgusting hack that helps..
 * 	1) automatically resume web audio contexts on user interaction
 * 	2) automatically pause and resume web audio when the page is hidden.
 * 	3) ios only: web audio play on the media channel rather than the ringer channel
 * 	4) ios only: disable the media playback widget and airplay when:
 *
 * WebAudio is automatically resumed by checking context state and resuming whenever possible.
 *
 * WebAudio pausing is accomplished by watching the page visilibility API. When on iOS, page focus
 * is also used to determine if the page is in the foreground because Apple's page vis api implementation is buggy.
 *
 * iOS Only: Forcing WebAudio onto the media channel (instead of the ringer channel) works by playing
 * a short, high-quality, silent html audio track continuously when web audio is playing.
 *
 * iOS Only: Hiding the media playback widgets on iOS is accomplished by completely nuking the silent
 * html audio track whenever the app isn't in the foreground.
 *
 * iOS detection is done by looking at the user agent for iPhone, iPod, iPad. This detects the phones fine, but
 * apple likes to pretend their new iPads are computers (lol right..). Newer iPads are detected by finding
 * mac osx in the user agent and then checking for touch support by testing navigator.maxTouchPoints \> 0.
 *
 * This is all really gross and apple should really fix their janky browser.
 * This code isn't optimized in any fashion, it is just whipped up to help someone out on stack overflow, its just meant as an example.
 */

/**
 * EventHandlerNonNull
 * Type alias for an event handler with definite non-null input value
 */
type EventHandlerNonNull = (e: Event) => void;

/**
 * Extension of the Event Type for use with unmute
 */
type UnmuteEvent = Event & { unmuteHandled?: boolean };

function addEventListeners(
  target: EventTarget,
  events: string[],
  handler: EventHandlerNonNull,
  capture: boolean,
  passive: boolean,
): void {
  events.forEach((e) => {
    target.addEventListener(e, handler, {
      capture: capture,
      passive: passive,
    });
  });
}

function removeEventListeners(
  target: EventTarget,
  events: string[],
  handler: EventHandlerNonNull,
  capture: boolean,
  passive: boolean,
): void {
  events.forEach((e) =>
    target.removeEventListener(e, handler, {
      capture: capture,
      passive: passive,
    } as EventListenerOptions),
  );
}

/**
 * Enables unmute.
 * @param context - A reference to the web audio context to "unmute".
 * @param allowBackgroundPlayback - Optional. Default false. Allows audio to continue to play in the background. This is not recommended because it will burn battery and display playback controls on the iOS lockscreen.
 * @param forceIOSBehavior - Optional. Default false. Forces behavior to that which is on iOS. This *could* be used in the event the iOS detection fails (which it shouldn't). It is strongly recommended NOT to use this.
 * @returns An object containing a dispose function which can be used to dispose of the unmute controller.
 */
export function unmute(
  context: AudioContext,
  allowBackgroundPlayback = false,
  forceIOSBehavior = false,
): { dispose: { (): void } } {
  const hidden = document.hidden !== undefined;

  /**
   * Helper no-operation function to ignore promises safely
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  function noop(): void {}

  const ua: string = navigator.userAgent.toLowerCase();
  const isIOS: boolean =
    forceIOSBehavior ||
    (ua.indexOf('iphone') >= 0 && ua.indexOf('like iphone') < 0) ||
    (ua.indexOf('ipad') >= 0 && ua.indexOf('like ipad') < 0) ||
    (ua.indexOf('ipod') >= 0 && ua.indexOf('like ipod') < 0) ||
    (ua.indexOf('mac os x') >= 0 && navigator.maxTouchPoints > 0); // New ipads show up as macs in user agent, but they have a touch screen

  /** Indicates if audio should be allowed to play. */
  let allowPlayback = true; // Assume page is visible and focused by default

  /**
   * Updates playback state.
   */
  function updatePlaybackState(): void {
    // Check if should be active
    const shouldAllowPlayback: boolean =
      allowBackgroundPlayback || // always be active if noPause is indicated
      ((!hidden || !document.hidden) && // can be active if no page vis api, or page not hidden
        (!isIOS || document.hasFocus())) // if ios, then document must also be focused because their page vis api is buggy
        ? true
        : false;

    // Change state
    if (shouldAllowPlayback !== allowPlayback) {
      allowPlayback = shouldAllowPlayback;

      // Update the channel state
      updateChannelState(false);

      // The playback allowed state has changed, update the context state to suspend / resume accordingly
      updateContextState();
    }
  }

  /**
   * Handle visibility api events.
   */
  const onVisChange = (): void => {
    updatePlaybackState();
  };
  if (hidden) {
    addEventListeners(document, ['visibilitychange'], onVisChange, true, true);
  }

  /**
   * Handles blur events (only used on iOS because it doesn't dispatch vis change events properly).
   */
  function win_focusChange(evt?: Event): void {
    if (evt && evt.target !== window) return; // ignore bubbles
    updatePlaybackState();
  }

  if (isIOS) {
    addEventListeners(window, ['focus', 'blur'], win_focusChange, true, true);
  }

  /**
   * Updates the context state.
   * NOTE: apple supports (and poorly at that) the proposed "interrupted" state spec, just ignore that for now.
   */
  function updateContextState(): void {
    if (allowPlayback) {
      // Want to be running, so try resuming if necessary
      if (context.state !== 'running' && context.state !== 'closed') {
        // do nothing if the context was closed to avoid errors... can't check for the suspended state because of apple's crappy interrupted implementation
        // Can only resume after a media playback (input) event has occurred
        if (hasMediaPlaybackEventOccurred) {
          const p: Promise<void> = context.resume();
          if (p) p.then(noop, noop).catch(noop);
        }
      }
    } else {
      // Want to be suspended, so try suspending
      if (context.state === 'running') {
        const p: Promise<void> = context.suspend();
        if (p) p.then(noop, noop).catch(noop);
      }
    }
  }

  /**
   * Handles context statechange events.
   * @param evt -  The event.
   */
  const context_statechange = (evt: UnmuteEvent): void => {
    if (!evt || !evt.unmuteHandled) {
      evt.unmuteHandled = true;
      // The context may have auto changed to some undesired state, so immediately check again if we want to change it
      updateContextState();
    }
  };

  context.addEventListener('statechange', context_statechange, {
    capture: true,
    passive: true,
  });
  // NOTE: IIRC older androids don't support the statechange event via addeventlistener, so handle it both ways
  if (!context.onstatechange) context.onstatechange = context_statechange;

  /** The html audio element that forces web audio playback onto the media channel instead of the ringer channel. */
  let channelTag: HTMLAudioElement | null = null;

  /**
   * A very short bit of silence to be played with <audio>, which forces AudioContext onto the ringer channel.
   * NOTE: The silence MP3 must be high quality, when web audio sounds are played in parallel the web audio sound is mixed to match the bitrate of the html sound.
   * This file is 0.01 seconds of silence VBR220-260 Joint Stereo 859B
   * The str below is a "compressed" version using poor mans huffman encoding, saves about 0.5kb
   */
  const silence: string =
    'data:audio/mpeg;base64,//uQx' +
    'A'.repeat(23) +
    'WGluZwAAAA8AAAACAAACcQCA' +
    'gICA'.repeat(16) +
    '/'.repeat(66) +
    '8AAABhTEFNRTMuMTAwA8MAAAAAAAAAABQgJAUHQQAB9AAAAnGMHkkI' +
    'A'.repeat(320) +
    '//sQxAADgnABGiAAQBCqgCRMAAgEAH' +
    '/'.repeat(15) +
    '7+n/9FTuQsQH//////2NG0jWUGlio5gLQTOtIoeR2WX////X4s9Atb/JRVCbBUpeRUq' +
    '/'.repeat(18) +
    '9RUi0f2jn/+xDECgPCjAEQAABN4AAANIAAAAQVTEFNRTMuMTAw' +
    'V'.repeat(97) +
    'Q==';

  /**
   * Updates the html audio channel control.
   * @param isMediaPlaybackEvent - Indicates if being called from within a media playback event handler.
   */
  function updateChannelState(isMediaPlaybackEvent: boolean): void {
    // Totally unnecessary outside of iOS
    if (isIOS) {
      if (allowPlayback) {
        // We want to be playing back on the media channel, but can only do so from an allowed input event
        if (isMediaPlaybackEvent) {
          // Create a new channel tag if necessary
          if (!channelTag) {
            const tmp: HTMLDivElement = document.createElement('div');
            tmp.innerHTML = "<audio x-webkit-airplay='deny'></audio>"; // Airplay like controls on other devices, prevents casting of the tag, doesn't work on modern iOS
            channelTag = tmp.children.item(0) as HTMLAudioElement;
            channelTag.controls = false;
            channelTag.disableRemotePlayback = true; // Airplay like controls on other devices, prevents casting of the tag, doesn't work on modern iOS
            channelTag.preload = 'auto';
            channelTag.src = silence;
            channelTag.loop = true;
            channelTag.load();
          }

          // Play the channel tag
          if (channelTag.paused) {
            const p: Promise<void> = channelTag.play();
            if (p) p.then(noop, destroyChannelTag).catch(destroyChannelTag); // If playback fails the tag is pretty much trash and needs to be recreated on next media playback event
          }
        }
      } else {
        // We don't want to be allowing playback at all at the moment, so destroy the channel tag to halt playback and hide those silly iOS media controls
        destroyChannelTag();
      }
    }
  }

  /**
   * Complete unloads / destroys the channel tag.
   */
  function destroyChannelTag(): void {
    if (channelTag) {
      // Change src to nothing and trigger a load, this is required to actually hide / clear the iOS playback controls
      channelTag.src = 'about:blank';
      channelTag.load();
      channelTag = null;
    }
  }
  //#endregion

  //#region Input
  /** The event types that can trigger media playback. */
  const mediaPlaybackEvents: string[] = [
    'click',
    'contextmenu',
    'auxclick',
    'dblclick',
    'mousedown',
    'mouseup',
    'touchend',
    'keydown',
    'keyup',
  ];

  /** Tracks if a media playback event has occurred */
  let hasMediaPlaybackEventOccurred = false;

  /**
   * Handles events that can begin media playback.
   */
  function win_mediaPlaybackEvent(): void {
    hasMediaPlaybackEventOccurred = true;

    // This is an opportunity to resume the html audio channel control
    updateChannelState(true);

    // This is an opportunity to resume the context if paused
    updateContextState();
  }
  addEventListeners(
    window,
    mediaPlaybackEvents,
    win_mediaPlaybackEvent,
    true,
    true,
  );
  //#endregion

  return {
    /**
     * Disposes unmute, relinquishing all control of media playback.
     */
    dispose: function (): void {
      // Stop / clean up the channel tag
      destroyChannelTag();

      // Remove all listeners
      if (hidden)
        removeEventListeners(
          document,
          ['visibilitychange'],
          onVisChange,
          true,
          true,
        );
      if (isIOS)
        removeEventListeners(
          window,
          ['focus', 'blur'],
          win_focusChange,
          true,
          true,
        );
      removeEventListeners(
        window,
        mediaPlaybackEvents,
        win_mediaPlaybackEvent,
        true,
        true,
      );
      removeEventListeners(
        context,
        ['statechange'],
        context_statechange,
        true,
        true,
      );
      if (context.onstatechange === context_statechange)
        context.onstatechange = null;
    },
  };
}
