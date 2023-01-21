import './SoundControl.css';
import { Component, createEffect } from 'solid-js';
import { SoundControlModelCtx } from 'src/models';
import { useAudioContext, useObservable } from 'src/hooks';
import { PlaybackPositionNode } from 'src/audio/PlaybackPositionNode';

// Min animation duration in seconds to avoid immediate stop before
// node.playbackPosition updates
const MIN_ANIM_DURATION = 0.01; // s

type SoundControlProps = {
  model: SoundControlModelCtx;
  onClick?: () => void;
};

export const SoundControlCtx: Component<SoundControlProps> = ({
  model,
  onClick,
}) => {
  let container: HTMLDivElement;
  let canvas: HTMLCanvasElement;
  let node: PlaybackPositionNode | undefined;
  let playing = false; // is audio playing
  let lastPos = 0; // last sample playback position
  const audioContext = useAudioContext();
  const [playbackRate] = useObservable(model.playbackRate);

  // Set playback rate from model
  createEffect(() => {
    // Call playbackRate signal outside of branch to capture reactivity
    const x = playbackRate();
    if (node) {
      node.audio.playbackRate.value = x;
    }
  });

  function animate(timestamp?: DOMHighResTimeStamp) {
    const ctx = canvas.getContext('2d');
    const pos = node!.playbackPosition;
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width * pos, canvas.height);

    // Timestamp is only defined after the first call
    // Depending on the timestamp allows us to retrigger the animation
    if (timestamp && lastPos > pos) playing = false;
    lastPos = pos;
    if (playing) {
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  return (
    <div ref={container!} class="soundControl" onClick={onClick}>
      <canvas ref={canvas!} />
      <button
        onClick={() => {
          if (!audioContext()) {
            return;
          }
          if (node) {
            node.stop();
          }
          node = new PlaybackPositionNode(audioContext()!, {
            playbackRate: playbackRate(),
          });
          node.loadBuffer(model.audioBuffer);
          node.connect(audioContext()!.destination);
          node.start();
          playing = true;
          animate();
        }}
      >
        <div class="label">{model.label}</div>
        <div>&#9658;</div>
      </button>
      <button
        onClick={() => {
          node?.stop();
          playing = false;
        }}
      >
        &#9632;
      </button>
    </div>
  );
};
