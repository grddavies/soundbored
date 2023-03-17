import { createDexieArrayQuery } from 'solid-dexie';
import { BiSolidFolderOpen, BiSolidTrash } from 'solid-icons/bi';
import { Component, createSignal, For } from 'solid-js';
import { useDoubleTap, useSelectedSampler } from 'src/hooks';
import { updateSampleSrc } from 'src/models/SamplePlayer';
import { SampleStore } from 'src/samples';
import { persistGlobalState } from 'src/store/AppState';

import style from './SampleExplorer.module.css';

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
    <div class={`${style.sampleExplorer} w-16rem`}>
      <div class={`${style['sampleExplorer-header']} flex gap-1`}>
        <BiSolidFolderOpen />
        <div>Samples</div>
      </div>
      <div
        class={style['sampleExplorer-list']}
        onMouseLeave={() => {
          setSelectedIdx(null);
        }}
      >
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
                  'grid grid-nogutter': true,
                  [style['sampleExplorer-item']]: true,
                  [style.selected]: i() === selectedIdx(),
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
                        class={style.icon}
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
