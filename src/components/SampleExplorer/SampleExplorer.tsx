import './SampleExplorer.css';

import { createDexieArrayQuery } from 'solid-dexie';
import { BiRegularCloudUpload, BiSolidTrash } from 'solid-icons/bi';
import { Component, createSignal, For } from 'solid-js';
import { useDoubleTap, useSelectedSampler } from 'src/hooks';
import { updateSampleSrc } from 'src/models';
import { SampleStore } from 'src/samples';
import { persistGlobalState } from 'src/store/AppState';

/**
 * Renders list of available sample files
 */
export const SampleExplorer: Component = () => {
  const samples = createDexieArrayQuery(() =>
    SampleStore.instance.getAllSampleFileNames(),
  );
  const [selectedIdx, setSelectedIdx] = createSignal<number | null>(null);
  const { mutateSelected } = useSelectedSampler();
  return (
    <div
      class={`sampleExplorer col-3`}
      onMouseLeave={() => {
        setSelectedIdx(null);
      }}
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
              SampleStore.instance.addSampleFromFile(f);
            }
          }
        }}
      />
      <div class="sampleExplorer-header grid grid-nogutter">
        <div class="col-9">Samples</div>
        <div class="col-3">
          <button
            class="upload"
            onClick={() => document.getElementById('fileExplorer')?.click()}
          >
            <BiRegularCloudUpload size={18} />
          </button>
        </div>
      </div>
      <div class="sampleExplorer-list">
        <For each={samples}>
          {(samplePath, i) => {
            let fileRef: HTMLDivElement;
            useDoubleTap(
              () => fileRef!,
              () =>
                mutateSelected((sampler) => {
                  updateSampleSrc(sampler, samplePath);
                  persistGlobalState();
                }),
            );
            return (
              <div
                ref={fileRef!}
                classList={{
                  'sampleExplorer-item grid grid-nogutter': true,
                  selected: i() === selectedIdx(),
                }}
                draggable={true}
                onDragStart={(e) => {
                  e.dataTransfer?.setData(
                    'text/plain',
                    e.target.textContent ?? '',
                  );
                }}
                onMouseOver={() => {
                  setSelectedIdx(i);
                }}
              >
                <div class={i() === selectedIdx() ? 'col-9' : 'col'}>
                  {samplePath as string}
                </div>
                {i() === selectedIdx() && (
                  <div class="col-3">
                    <button>
                      <BiSolidTrash
                        class="icon"
                        onClick={async () => {
                          // TODO: use non-blocking modal
                          confirm(`Delete '${samplePath}' from sample bank?`) &&
                            SampleStore.instance.deleteSampleByName(samplePath);
                          // fixme: this will break any sampleplayers with this sample loaded
                        }}
                      />
                    </button>
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
