import './SampleControls.css';

import { Component, createSignal } from 'solid-js';
import { Knob } from 'src/components';
import { SampleView } from 'src/components';
import { LABEL_CHAR_LIMIT } from 'src/defaults/constants';
import { useSelectedSampler } from 'src/hooks';
import { SamplePlayer } from 'src/models/SamplePlayer';

export const SampleControls: Component = () => {
  const [editingLabel, setEditingLabel] = createSignal(false);
  const { selected, mutateSelected } = useSelectedSampler();
  return (
    <div class="sampleControls col px-2">
      <div class="flex">
        <div class="sampleLabel">
          {editingLabel() ? (
            <input
              type="text"
              value={selected().label}
              maxlength={LABEL_CHAR_LIMIT}
              class="sampleLabel"
              onInput={(e) => {
                mutateSelected((sampler: SamplePlayer) => {
                  sampler.label = e.currentTarget.value;
                });
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
              {selected().label}
            </div>
          )}
        </div>
        <div>/{selected().src}</div>
      </div>
      <SampleView model={selected()} />
      <div class="grid grid-nogutter pt-2">
        <Knob
          value={selected().playbackRate}
          updateFunc={(value: number) =>
            mutateSelected((sampler) => {
              sampler.playbackRate = value;
            })
          }
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
