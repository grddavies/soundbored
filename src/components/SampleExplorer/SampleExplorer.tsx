import { createDexieArrayQuery } from 'solid-dexie';
import { BiSolidTrash } from 'solid-icons/bi';
import { ImDownload2 } from 'solid-icons/im';
import { Component, createResource, createSignal, For, Show } from 'solid-js';
import { useDoubleTap, useSelectedSampler } from 'src/hooks';
import { updateSampleSrc } from 'src/models/SamplePlayer';
import { SampleStore } from 'src/samples';
import { persistGlobalState } from 'src/store/AppState';
import { formatBytes } from 'src/utils';

/**
 * Renders list of available sample files
 */
export const SampleExplorer: Component = () => {
  const samples = createDexieArrayQuery(() =>
    SampleStore.instance.getAllSampleFileNames(),
  );
  const [selectedIdx, setSelectedIdx] = createSignal<number | undefined>(
    undefined,
  );
  const currentSamplePath = (): string | undefined =>
    selectedIdx() != null ? samples[selectedIdx()!] : undefined;

  const { mutateSelected } = useSelectedSampler();
  return (
    <div class="w-full h-full flex">
      <div class="relative h-full w-full flex flex-column border-right-1 border-200 text-left">
        <div class="text-lg pl-2 border-bottom-1 border-100">Samples</div>
        <Show when={currentSamplePath() != null}>
          <FileInfoPanel path={currentSamplePath()!} />
        </Show>
        <div class="h-full overflow-y-auto">
          <ul class="list-none text-sm">
            <For each={samples}>
              {(samplePath, i) => {
                let fileRef: HTMLLIElement;
                useDoubleTap(
                  () => fileRef,
                  () =>
                    mutateSelected((sampler) => {
                      updateSampleSrc(sampler, samplePath);
                      persistGlobalState();
                    }),
                );
                return (
                  <li
                    ref={(e) => (fileRef = e)}
                    class={`pl-2 border-1 border-transparent overflow-hidden text-overflow-ellipsis white-space-nowrap ${
                      selectedIdx() === i()
                        ? 'bg-indigo-400 border-indigo-200'
                        : 'hover:surface-300'
                    }`}
                    draggable={true}
                    onDragStart={(e) => {
                      e.dataTransfer?.setData(
                        'text/plain',
                        e.target.textContent ?? '',
                      );
                    }}
                    onPointerDown={() => {
                      setSelectedIdx(i() === selectedIdx() ? undefined : i());
                    }}
                  >
                    {samplePath}
                  </li>
                );
              }}
            </For>
          </ul>
        </div>
      </div>
    </div>
  );
};

/**
 * Renders details about the selected sample file
 */
const FileInfoPanel: Component<{ path: string }> = (props) => {
  const { mutateSelected } = useSelectedSampler();
  const [file] = createResource(
    () => props.path,
    async (src) => SampleStore.instance.getSampleBlob(src),
  );
  return (
    <div class="absolute top-0 left-50 w-6 h-full surface-100 shadow-2">
      <div class="flex flex-column h-full">
        <div class="px-2 text-lg border-bottom-1 border-200">File info</div>
        <div class="flex-grow-1">
          <div class="p-2 text-xs select-text">
            <div>Filename:</div>
            <div class="text-color-secondary">{props.path}</div>
            <div>Size:</div>
            <div class="text-color-secondary">
              {formatBytes(file()?.size ?? 0, true)}
            </div>
            <div>Type:</div>
            <div class="text-color-secondary">{file()?.type}</div>
          </div>
        </div>
        <div class="p-2 flex text-sm gap-2 w-full">
          <button
            class="bg-primary h-2rem flex justify-content-center align-items-center flex-grow-1"
            onClick={() => {
              mutateSelected((sampler) => {
                updateSampleSrc(sampler, props.path);
                persistGlobalState();
              });
            }}
          >
            <ImDownload2 />
          </button>
          <button
            class="h-2rem flex justify-content-center align-items-center flex-grow-1"
            onClick={async () => {
              if (confirm(`Delete '${props.path}'`)) {
                SampleStore.instance.deleteSampleByName(props.path);
              }
            }}
          >
            <BiSolidTrash />
          </button>

          {/* <button */}
          {/*   class="h-2rem flex justify-content-center align-items-center flex-grow-1" */}
          {/* > */}
          {/*   <BiRegularPencil /> */}
          {/* </button> */}
        </div>
      </div>
    </div>
  );
};
