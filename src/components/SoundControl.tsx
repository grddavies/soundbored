import './SoundControl.css';
import { useRef } from 'react';

type SoundControlProps = {
  src: string;
  label?: string;
};

export const SoundControl: React.FunctionComponent<SoundControlProps> = ({
  src,
  label,
}): JSX.Element => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const container = useRef<HTMLDivElement>(null);

  // Reset playhead and begin playing
  const handlePlay = async () => {
    const el = audioRef.current;
    const progress = container.current;
    if (!el) {
      return;
    }
    el.currentTime = 0;
    el.play();
    progress?.animate([{ width: 0 }, { width: '100%' }], {
      id: 'progress-bar',
      duration: el.duration * 1000,
      iterations: 1,
      pseudoElement: '::before',
    });
  };

  // Stop playback and reset playhead
  const handleStop = async () => {
    const el = audioRef.current;
    const progress = container.current;
    if (!el) {
      return;
    }
    el.pause();
    el.currentTime = 0;
    progress
      ?.getAnimations({ subtree: true })
      .filter(({ id }) => id === 'progress-bar').forEach(
        (animation) => animation.cancel())
  };

  return (
    <div ref={container} className="soundControl">
      <audio ref={audioRef} src={src} preload="auto" />
      <button onClick={handlePlay}>
        <div>{label}</div>
        <div>&#9658;</div>
      </button>
      <button onClick={handleStop}>&#9632;</button>
    </div>
  );
};
