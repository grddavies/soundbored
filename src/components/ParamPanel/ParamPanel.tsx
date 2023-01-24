import { Component, For } from 'solid-js';
import { createDexieArrayQuery } from 'solid-dexie';

import { useObservable } from 'src/hooks/useObservable';
import { SamplerModel } from 'src/models';

import './ParamPanel.css';
import { AppStore } from 'src/store';

type ParamPanelProps = {
  model: SamplerModel;
};

export const ParamPanel: Component<ParamPanelProps> = (props) => {
  const samples = createDexieArrayQuery(() =>
    // Get all files in sample db
    AppStore.instance.sample.toCollection().keys(),
  );
  const [playbackRate, setPlaybackRate] = useObservable(
    props.model.playbackRate,
  );
  const [src, setSrc] = useObservable(props.model.src);
  return (
    <div class="parameterPanel">
      <div class="grid">
        <div class="col">
          <h2>{props.model.label.value}</h2>
          <select
            value={src()}
            autocomplete="false"
            onChange={async (e) => {
              setSrc(e.currentTarget.value);
            }}
          >
            <option value={''}>-- samples --</option>
            <For each={samples}>
              {(file) => (
                <option disabled={src() === file} value={file as string}>
                  {file as string}
                </option>
              )}
            </For>
          </select>
          <p>Sample</p>
          <input
            type="range"
            min={0.2}
            step={0.05}
            max={2.0}
            value={playbackRate()}
            onInput={(e) => setPlaybackRate(e.currentTarget.valueAsNumber)}
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
