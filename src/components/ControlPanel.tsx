import { Component } from 'solid-js';
import { useObservable } from '../useObservable';
import { SoundControlModel } from './SoundControlModel';

import './ControlPanel.css';

type ControlPanelProps = {
  model: SoundControlModel;
};

export const ControlPanel: Component<ControlPanelProps> = (props) => {
  const [playbackRate, setPlaybackRate] = useObservable(
    props.model.playbackRate,
  );
  return (
    <div class="controlPanel">
      <div class="flex-grid">
        <div class="col">
          <h2>{props.model.label}</h2>
          <input
            type="range"
            min={0.2}
            step={0.05}
            max={2.0}
            value={playbackRate()}
            onChange={(e) => setPlaybackRate(parseFloat(e.currentTarget.value))}
            onClick={(e) => {
              if (e.detail > 1) {
                setPlaybackRate(1.0);
              }
            }}
          />
          <p>Playback speed</p>
        </div>
      </div>
    </div>
  );
};
