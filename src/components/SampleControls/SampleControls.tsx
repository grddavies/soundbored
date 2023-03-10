import { Component, createSignal } from 'solid-js';
import { Knob } from 'src/components';
import { SampleView } from 'src/components';
import { LABEL_CHAR_LIMIT } from 'src/defaults/constants';
import { useSelectedSampler } from 'src/hooks';
import { SamplePlayer } from 'src/models/SamplePlayer';
import { persistGlobalState } from 'src/store/AppState';

import style from './SampleControls.module.css';

/**
 * Renders a set of controls to edit the selected SamplePlayer
 * @returns
 */
export const SampleControls: Component = () => {
  const [editingLabel, setEditingLabel] = createSignal(false);
  const { selected, mutateSelected } = useSelectedSampler();
  return (
    <div class={`${style.sampleControls} col px-2 text-xs`}>
      <div class="h-1rem inline-flex flex-gap-1">
        <div class="w-4">
          {editingLabel() ? (
            <input
              type="text"
              value={selected().label}
              maxlength={LABEL_CHAR_LIMIT}
              class={`${style.labelInput} h-1rem w-full text-xs`}
              onInput={(e) => {
                mutateSelected((sampler: SamplePlayer) => {
                  sampler.label = e.currentTarget.value;
                });
              }}
              onChange={() => persistGlobalState()}
              onKeyUp={(e) => {
                if (e.key === 'Enter') setEditingLabel(false);
              }}
              onMouseLeave={() => {
                setEditingLabel(false);
              }}
            />
          ) : (
            <span
              class="inline-block w-full"
              onClick={() => {
                setEditingLabel(true);
              }}
            >
              {selected().label}
            </span>
          )}
        </div>
        <div class="w-full">/{selected().src}</div>
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
