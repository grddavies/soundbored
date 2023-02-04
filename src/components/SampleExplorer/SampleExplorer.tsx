import { createDexieArrayQuery } from 'solid-dexie';
import { BiSolidFolderPlus, BiSolidTrash } from 'solid-icons/bi';
import { Component, createSignal, For } from 'solid-js';

import { useDoubleTap } from 'src/hooks/useDoubleTap';
import { SamplerModel } from 'src/models';
import { AppStore } from 'src/store';

import './SampleExplorer.css';

type SampleExplorerProps = {
  selectedSampler: SamplerModel;
};

export const SampleExplorer: Component<SampleExplorerProps> = (props) => {
  // Get all files in sample db
  const samples = createDexieArrayQuery(() =>
    AppStore.instance.getAllSampleFileNames(),
  );
  const [selectedIdx, setSelectedIdx] = createSignal<number | null>(null);
  return (
    <div
      class={`sampleExplorer col-3`}
      onMouseLeave={() => setSelectedIdx(null)}
    >
      <input
        id="fileExplorer"
        type="file"
        accept="audio/*"
        hidden
        multiple
        onChange={(e) => {
          if (e.currentTarget.files) {
            for (const f of e.currentTarget.files) {
              AppStore.instance.addSampleFromFile(f);
            }
          }
        }}
      />
      <div class="sampleExplorer-header grid grid-nogutter">
        <div class="col-9">Samples</div>
        <div class="col-3 flex align-items-center justify-content-center">
          <BiSolidFolderPlus
            class="icon"
            onClick={() => document.getElementById('fileExplorer')?.click()}
          />
        </div>
      </div>
      <div class="sampleExplorer-list">
        <For each={samples}>
          {(sample, i) => {
            let fileRef: HTMLDivElement;
            useDoubleTap(
              () => fileRef!,
              () => {
                props.selectedSampler.src.value = sample;
              },
            );
            return (
              <div
                ref={fileRef!}
                classList={{
                  'sampleExplorer-item grid grid-nogutter': true,
                  selected: i() === selectedIdx(),
                }}
                draggable={true}
                onDragStart={(e) =>
                  e.dataTransfer?.setData(
                    'text/plain',
                    e.target.textContent ?? '',
                  )
                }
                onMouseOver={() => setSelectedIdx(i)}
              >
                <div class={i() === selectedIdx() ? 'col-9' : 'col'}>
                  {sample as string}
                </div>
                {i() === selectedIdx() && (
                  <div class="col-3 flex align-items-center justify-content-center">
                    <BiSolidTrash
                      class="icon"
                      onClick={async () =>
                        // TODO: use non-blocking modal
                        confirm(`Delete '${sample}' from sample bank?`) &&
                        AppStore.instance.deleteSampleByName(sample)
                      }
                    />
                  </div>
                )}
              </div>
            );
          }}
        </For>
      </div>
    </div>
  );
};
