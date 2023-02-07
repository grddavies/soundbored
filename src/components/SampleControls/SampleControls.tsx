import { Component, createSignal } from 'solid-js';

import { useDoubleTap } from 'src/hooks/useDoubleTap';
import { useObservable } from 'src/hooks/useObservable';
import { SamplerModel } from 'src/models';
import { KnobWrapper } from '../Knob/KnobWrapper';
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
    <div class="sampleControls col px-2">
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
      <div class="grid grid-nogutter pt-2">
        <KnobWrapper
          value={props.model.playbackRate}
          defaultValue={1}
          min={0.01}
          max={2.0}
          size={50}
          label="Playback Speed"
        />
      </div>
    </div>
  );
};
