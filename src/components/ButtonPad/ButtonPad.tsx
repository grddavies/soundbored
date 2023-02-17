import './ButtonPad.css';

import { createPointerListeners } from '@solid-primitives/pointer';
import { BiRegularPlay, BiRegularStop } from 'solid-icons/bi';
import { Component, createEffect, createMemo, JSX } from 'solid-js';
import { AudioPlayerNode } from 'src/audio/AudioPlayerNode';
import { useObservable } from 'src/hooks';
import { SamplerModel } from 'src/models';

type ButtonPadProps = {
  model: SamplerModel;
  onClick?: () => void;
} & JSX.CustomAttributes<HTMLDivElement>;

export const ButtonPad: Component<ButtonPadProps> = (props) => {
  let container: HTMLDivElement;
  let canvas: HTMLCanvasElement;
  let node: AudioPlayerNode | undefined;
  let playButton: HTMLButtonElement;
  let stopButton: HTMLButtonElement;

  const viewModel = createMemo(() => {
    const [playbackRate] = useObservable(props.model.playbackRate);
    const [label] = useObservable(props.model.label);
    return {
      get playbackRate(): number {
        return playbackRate();
      },

      get label(): string {
        return label();
      },
    };
  });

  // Set playback rate from model
  createEffect(() => {
    // Call playbackRate signal outside of branch to capture reactivity
    const x = viewModel().playbackRate;
    if (node) {
      node.audio.playbackRate.value = x;
    }
  });

  /** Animate the canvas overlaying the button */
  function animate(): void {
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

  const handlePlay = (): void => {
    if (!props.model.audioContext.value || !props.model.loaded) {
      return;
    }
    node?.stop();
    node = new AudioPlayerNode(props.model.audioContext.value, {
      playbackRate: viewModel().playbackRate,
    });
    node.loadBuffer(props.model.audioBuffer);
    node.connect(props.model.audioContext.value.destination);
    node.start();
    animate();
  };

  const handleStop = (): void => {
    if (node && props.model.loaded) {
      node.stop();
    }
  };

  createPointerListeners({
    target: () => playButton,
    pointerTypes: ['touch', 'pen', 'mouse'],
    onDown: handlePlay,
  });

  createPointerListeners({
    target: () => stopButton!,
    pointerTypes: ['touch', 'pen', 'mouse'],
    onDown: handleStop,
  });

  return (
    <div
      ref={container!}
      class="buttonPad"
      onClick={props.onClick}
      classList={props.classList}
    >
      <canvas ref={canvas!} />
      <button ref={playButton!}>
        <div class="label">{viewModel().label}</div>
        <BiRegularPlay size={24} />
      </button>
      <button ref={stopButton!}>
        <BiRegularStop size={24} />
      </button>
    </div>
  );
};
