import { createReducer } from '@solid-primitives/reducer';
import { createDexieArrayQuery } from 'solid-dexie';
import { BiSolidFolder, BiSolidFolderOpen, BiSolidTrash } from 'solid-icons/bi';
import { Component, createSignal, For, Show } from 'solid-js';
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
  const [collapsed, toggleCollapsed] = createReducer((x) => !x, false);
  const [selectedIdx, setSelectedIdx] = createSignal<number | null>(null);
  const { mutateSelected } = useSelectedSampler();
  return (
    <div
      class={`${
        style.sampleExplorer
      } h-full flex flex-column text-left overflow-hidden ${
        collapsed() ? 'w-2rem' : 'w-14rem'
      }`}
    >
      <div class={`${style.headerBox} flex pl-1 align-center`}>
        <button
          class={`m-1 ${style.interaction} ${style.btn}`}
          onClick={() => toggleCollapsed()}
        >
          {collapsed() ? <BiSolidFolder /> : <BiSolidFolderOpen />}
        </button>
        {!collapsed() && <span class="text-base">Samples</span>}
      </div>
      <Show when={!collapsed()}>
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
                    [`${style.listItem} flex pl-2 justify-content-between`]:
                      true,
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
                  <div>{samplePath as string}</div>
                  <Show when={i() === selectedIdx()}>
                    <button
                      class={`${style.btn} w-2rem`}
                      onClick={async () => {
                        // TODO: use non-blocking modal
                        confirm(`Delete '${samplePath}' from sample bank?`) &&
                          SampleStore.instance.deleteSampleByName(samplePath);
                        // fixme: this will break any sampleplayers with this sample loaded
                      }}
                    >
                      <BiSolidTrash class={style.icon} />
                    </button>
                  </Show>
                </div>
              );
            }}
          </For>
        </div>
      </Show>
    </div>
  );
};
