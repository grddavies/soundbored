import { createSignal } from 'solid-js';
import { unmute } from 'src/audio/unmute';

const [AudioCtx, setAudioCtx] = createSignal<AudioContext | null>(null);

/**
 * Activates the Global Audio Context signal
 *
 * Must be used in a user interaction callback (ie onclick) to initialise the context in an active state
 * @param contextOptions - Options to pass to the new AudioContext
 * @param force - Initialise a new AudioContext even if another is running
 */
function activateAudioCtx(
  contextOptions?: AudioContextOptions,
  force = false,
): void {
  if (!force && AudioCtx()) {
    return;
  }
  const ctx = new AudioContext(contextOptions);
  unmute(ctx);
  setAudioCtx(ctx);
}

export {
  /**
   * # AudioCtx
   * ## Description
   * Global AudioContext signal
   */
  AudioCtx,
  activateAudioCtx,
};
