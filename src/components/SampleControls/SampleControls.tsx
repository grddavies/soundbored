import { Component, createSignal } from 'solid-js';
import { Knob } from 'src/components';
import { SampleView } from 'src/components';
import { LABEL_CHAR_LIMIT } from 'src/defaults/constants';
import { useSelectedSampler } from 'src/hooks';
import { SamplePlayer } from 'src/models/SamplePlayer';
import { persistGlobalState } from 'src/store/AppState';

/**
 * Renders a set of controls to edit the selected SamplePlayer
 * @returns
 */
export const SampleControls: Component = () => {
  const [editingLabel, setEditingLabel] = createSignal(false);
  const { selected, mutateSelected } = useSelectedSampler();
  return (
    <div class="h-full flex flex-column px-2 text-sm text-left">
      <div class="flex">
        <div class="w-8rem">
          {editingLabel() ? (
            <input
              type="text"
              value={selected().label}
              maxlength={LABEL_CHAR_LIMIT}
              class="border-none h-full w-full text-xs"
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
        <div class="flex-grow-1 text-right text-color-secondary w-2rem h-full overflow-hidden text-overflow-ellipsis white-space-nowrap">
          /{selected().src}
        </div>
      </div>

      <SampleView model={selected()} />
      <div class="flex flex-auto align-items-end py-2">
        <Knob
          value={selected().playbackRate}
          scaleFunc={(x) => x * 4}
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
        <Knob
          value={selected().camera.pan.x}
          scaleFunc={(x) => x * 2000}
          updateFunc={(value: number) =>
            mutateSelected((sampler) => {
              sampler.camera.pan.x = value;
            })
          }
          defaultValue={0}
          max={100000}
          size={50}
          label="Pan X"
        />
        <Knob
          value={selected().camera.zoom.x}
          scaleFunc={(x) => Math.pow(Math.E, 4 * x)}
          updateFunc={(value: number) =>
            mutateSelected((sampler) => {
              sampler.camera.zoom.x = value;
            })
          }
          defaultValue={1}
          min={1}
          max={16}
          size={50}
          label="Zoom X"
        />
      </div>
    </div>
  );
};
