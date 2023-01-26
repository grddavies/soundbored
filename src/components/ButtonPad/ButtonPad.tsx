import './ButtonPad.css';
import { Component, createEffect } from 'solid-js';
import { SamplerModel } from 'src/models';
import { useAudioContext, useObservable } from 'src/hooks';
import { AudioPlayerNode } from 'src/audio/AudioPlayerNode';

type ButtonPadProps = {
  model: SamplerModel;
  onClick?: () => void;
};

export const ButtonPad: Component<ButtonPadProps> = ({ model, onClick }) => {
  let container: HTMLDivElement;
  let canvas: HTMLCanvasElement;
  let node: AudioPlayerNode | undefined;
  const audioContext = useAudioContext();
  model.audioContext.value = audioContext();
  const [playbackRate] = useObservable(model.playbackRate);
  const [label] = useObservable(model.label);

  // Set playback rate from model
  createEffect(() => {
    // Call playbackRate signal outside of branch to capture reactivity
    const x = playbackRate();
    if (node) {
      node.audio.playbackRate.value = x;
    }
  });

  /** Animate the canvas overlaying the button */
  function animate() {
    const ctx = canvas.getContext('2d');
    const pos = node!.playbackPosition;
    if (!ctx) {
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Animation program - growing rectangle
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width * pos, canvas.height);

    if (node?.playing) {
      requestAnimationFrame(animate);
    } else {
      // Clear on animation end
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  return (
    <div ref={container!} class="buttonPad" onClick={onClick}>
      <canvas ref={canvas!} />
      <button
        onClick={() => {
          if (!audioContext() || !model.loaded) {
            return;
          }
          node?.stop();
          node = new AudioPlayerNode(audioContext()!, {
            playbackRate: playbackRate(),
          });
          node.loadBuffer(model.audioBuffer);
          node.connect(audioContext()!.destination);
          node.start();
          animate();
        }}
      >
        <div class="label">{label()}</div>
        <div>&#9658;</div>
      </button>
      <button
        onClick={() => {
          if (node && model.loaded) {
            node.stop();
          }
        }}
      >
        &#9632;
      </button>
    </div>
  );
};
