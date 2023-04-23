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
    <div class="flex-grow-1 flex flex-column px-2 text-xs text-left">
      <div class="h-1rem flex">
        <div class="w-6rem">
          {editingLabel() ? (
            <input
              type="text"
              value={selected().label}
              maxlength={LABEL_CHAR_LIMIT}
              class={`${style.labelInput} h-full w-full text-xs`}
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
            <div
              onClick={() => {
                setEditingLabel(true);
              }}
            >
              {selected().label}
            </div>
          )}
        </div>
        <div class="flex-grow-1 w-1rem h-full overflow-hidden text-overflow-ellipsis white-space-nowrap">
          /{selected().src}
        </div>
      </div>
      <SampleView model={selected()} />
      <div class="flex pt-2">
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
