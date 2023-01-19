import './SoundControl.css';
import { Component, createEffect } from 'solid-js';
import { SoundControlModel } from './SoundControlModel';
import { useObservable } from '../useObservable';

type SoundControlProps = {
  model: SoundControlModel;
  onClick?: () => void;
};

export const SoundControl: Component<SoundControlProps> = ({
  model,
  onClick,
}) => {
  let audioRef: HTMLAudioElement;
  let container: HTMLDivElement;

  const [playbackRate] = useObservable(model.playbackRate);
  const [preservePitch] = useObservable(model.preservePitch);

  /** Create a new animation */
  const animateButton = (startWidth: string) => {
    container.animate([{ width: startWidth }, { width: '100%' }], {
      id: 'progress-bar',
      duration:
        ((audioRef.duration - audioRef.currentTime) / audioRef.playbackRate) *
        1000,
      iterations: 1,
      pseudoElement: '::before',
    });
  };

  /** Clear existing animations */
  const clearAnimations = () => {
    container
      .getAnimations({ subtree: true })
      .filter(({ id }) => id === 'progress-bar')
      .forEach((animation) => animation.cancel());
  };

  // Set the audio playback rate from model
  createEffect(() => {
    // if (!audioRef.paused) {
    //   container
    //     .getAnimations({ subtree: true })
    //     .filter(({ id }) => id === 'progress-bar')
    //     .forEach((animation) => {
    //       animation;
    //     });
    // }
    audioRef.playbackRate = playbackRate();
    if (!audioRef.paused && audioRef.duration && audioRef.playbackRate) {
      clearAnimations();
      animateButton(`${(audioRef.currentTime / audioRef.duration) * 100}%`);
    }
  });

  // Set audio preserve pitch from model
  createEffect(() => {
    audioRef.preservesPitch = preservePitch();
  });

  return (
    <div ref={container!} class="soundControl" onClick={onClick}>
      <audio ref={audioRef!} src={model.src} preload="auto" />
      <button
        onClick={() => {
          audioRef.currentTime = 0;
          audioRef.play();
          animateButton(audioRef.currentTime);
        }}
      >
        <div>{model.label}</div>
        <div>&#9658;</div>
      </button>
      <button
        onClick={() => {
          audioRef.pause();
          audioRef.currentTime = 0;
          clearAnimations();
        }}
      >
        &#9632;
      </button>
    </div>
  );
};
