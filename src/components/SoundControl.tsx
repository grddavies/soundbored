import './SoundControl.css';
import type { Component } from 'solid-js';

type SoundControlProps = {
  src: string;
  label?: string;
};

export const SoundControl: Component<SoundControlProps> = ({ src, label }) => {
  let audioRef: HTMLAudioElement;
  let container: HTMLDivElement;
  return (
    <div ref={container!} class="soundControl">
      <audio ref={audioRef!} src={src} preload="auto" />
      <button
        onClick={() => {
          audioRef.currentTime = 0;
          audioRef.play();
          container.animate([{ width: 0 }, { width: '100%' }], {
            id: 'progress-bar',
            duration: (audioRef.duration / audioRef.playbackRate) * 1000,
            iterations: 1,
            pseudoElement: '::before',
          });
        }}
      >
        <div>{label}</div>
        <div>&#9658;</div>
      </button>
      <button
        onClick={() => {
          audioRef.pause();
          audioRef.currentTime = 0;
          container
            .getAnimations({ subtree: true })
            .filter(({ id }) => id === 'progress-bar')
            .forEach((animation) => animation.cancel());
        }}
      >
        &#9632;
      </button>
    </div>
  );
};
