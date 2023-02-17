import './SampleControls.css';

import { Component, createMemo, createSignal } from 'solid-js';
import { LABEL_CHAR_LIMIT } from 'src/defaults/constants';
import { useObservable } from 'src/hooks/useObservable';
import { SamplerModel } from 'src/models';

import { KnobWrapper } from '../Knob/KnobWrapper';
import { SampleView } from '../SampleView/SampleView';

type SampleControlsProps = {
  model: SamplerModel;
};

export const SampleControls: Component<SampleControlsProps> = (props) => {
  const [editingLabel, setEditingLabel] = createSignal(false);
  const viewModel = createMemo(() => {
    const [label, setLabel] = useObservable(props.model.label);
    const [src] = useObservable(props.model.src);
    return {
      get src(): string {
        return src();
      },
      get label(): string {
        return label();
      },
      set label(v: string) {
        setLabel(v);
      },
    };
  });
  return (
    <div class="sampleControls col px-2">
      <div class="flex">
        <div class="sampleLabel">
          {editingLabel() ? (
            <input
              type="text"
              value={viewModel().label}
              maxlength={LABEL_CHAR_LIMIT}
              class="sampleLabel"
              onInput={(e) => {
                viewModel().label = e.currentTarget.value;
              }}
              onKeyUp={(e) => {
                if (e.key === 'Enter') setEditingLabel(false);
              }}
              onMouseLeave={() => {
                setEditingLabel(false);
              }}
            />
          ) : (
            <div
              onClick={() => {
                setEditingLabel(true);
              }}
            >
              {viewModel().label}
            </div>
          )}
        </div>
        <div>/{viewModel().src}</div>
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
