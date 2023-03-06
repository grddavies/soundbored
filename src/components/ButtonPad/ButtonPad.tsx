import { createPointerListeners } from '@solid-primitives/pointer';
import { BiRegularPlay, BiRegularStop } from 'solid-icons/bi';
import { Component, createEffect, createResource, JSX } from 'solid-js';
import { AudioCtx } from 'src/audio';
import { AudioPlayerNode } from 'src/audio/AudioPlayerNode';
import { SamplePlayer } from 'src/models';
import { SampleStore } from 'src/samples';

import CSS from './ButtonPad.module.css';

type ButtonPadProps = {
  model: SamplePlayer;
  onClick?: () => void;
} & JSX.CustomAttributes<HTMLDivElement>;

/**
 * Renders a sampler control pad with play and stop buttons
 * @param props
 * @returns
 */
export const ButtonPad: Component<ButtonPadProps> = (props) => {
  let container: HTMLDivElement;
  let canvas: HTMLCanvasElement;
  let node: AudioPlayerNode | undefined;
  let playButton: HTMLButtonElement;
  let stopButton: HTMLButtonElement;

  // Combine AudioCtx and model.src signals
  const srcSignal = (): string | null => AudioCtx() && props.model.src;

  const [audioBuffer] = createResource(
    srcSignal,
    async (src: string): Promise<AudioBuffer | undefined> => {
      const data = await SampleStore.instance.getSampleBlob(src);
      if (!data) {
        return undefined;
      }
      return await AudioCtx()?.decodeAudioData(await data.arrayBuffer());
    },
  );

  // Set playback rate from model
  createEffect(() => {
    // Call playbackRate signal outside of branch to capture reactivity
    const x = props.model.playbackRate;
    if (node) {
      node.audio.playbackRate.value = x;
    }
  });

  /** Animate the canvas overlaying the button */
  function animate(): void {
    const ctx = canvas.getContext('2d');
    if (!ctx || !node) {
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Animation program - growing rectangle
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width * node.playbackPosition, canvas.height);
    if (node?.playing) {
      requestAnimationFrame(animate);
    } else {
      // Clear on animation end
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  const handlePlay = (): void => {
    const ctx = AudioCtx();
    if (!ctx) {
      return;
    }
    if (node && node.playing) {
      node.stop();
    }
    node = new AudioPlayerNode(ctx, {
      playbackRate: props.model.playbackRate,
    });
    const buf = audioBuffer();
    if (buf) {
      node.loadBuffer(buf);
      node.connect(ctx.destination);
      node.start();
      animate();
    }
  };

  const handleStop = (): void => {
    if (node && node.playing) {
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
      class={CSS.buttonPad}
      onClick={props.onClick}
      classList={props.classList}
    >
      <canvas ref={canvas!} />
      <button ref={playButton!} disabled={audioBuffer.loading}>
        <div class={CSS.label}>{props.model.label}</div>
        <BiRegularPlay size={24} />
      </button>
      <button ref={stopButton!} disabled={audioBuffer.loading}>
        <BiRegularStop size={24} />
      </button>
    </div>
  );
};
