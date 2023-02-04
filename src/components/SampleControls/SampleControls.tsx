import { Component, createSignal } from 'solid-js';
import { style } from 'solid-js/web';

import { useDoubleTap } from 'src/hooks/useDoubleTap';
import { useObservable } from 'src/hooks/useObservable';
import { SamplerModel } from 'src/models';
import { SampleView } from '../SampleView/SampleView';

import './SampleControls.css';

type SampleControlsProps = {
  model: SamplerModel;
};

export const SampleControls: Component<SampleControlsProps> = (props) => {
  let playbackRateControl: HTMLInputElement;
  const [label, setLabel] = useObservable(props.model.label);
  const [src] = useObservable(props.model.src);
  const [playbackRate, setPlaybackRate] = useObservable(
    props.model.playbackRate,
  );
  const [editingLabel, setEditingLabel] = createSignal(false);

  useDoubleTap(
    () => playbackRateControl!,
    () => {
      setPlaybackRate(1.0);
    },
  );

  return (
    <div class="sampleControls col h-full px-2">
      <div class="flex">
        <div class="sampleLabel">
          {editingLabel() ? (
            <input
              type="text"
              value={label()}
              maxlength="12"
              class="sampleLabel"
              onInput={(e) => setLabel(e.currentTarget.value)}
              onKeyUp={(e) => {
                if (e.key === 'Enter') setEditingLabel(false);
              }}
              onMouseLeave={() => setEditingLabel(false)}
            />
          ) : (
            <div onClick={() => setEditingLabel(true)}>{label()}</div>
          )}
        </div>
        <div>/{src()}</div>
      </div>
      <SampleView model={props.model} />
      <label for="playbackRateControl">Playback speed</label>
      <input
        ref={playbackRateControl!}
        id="playbackRateControl"
        type="range"
        min={0.01}
        step={0.01}
        max={2.0}
        style={{ width: '85%' }}
        value={playbackRate()}
        onInput={(e) => setPlaybackRate(e.currentTarget.valueAsNumber)}
      />
    </div>
  );
};
