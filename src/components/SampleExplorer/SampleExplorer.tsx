import { createDexieArrayQuery } from 'solid-dexie';
import { Component, createSignal, For } from 'solid-js';
import { AppStore } from 'src/store';
import { BiSolidTrash, BiSolidFolderPlus } from 'solid-icons/bi';

import './SampleExplorer.css';

type SampleExplorerProps = {};

export const SampleExplorer: Component<SampleExplorerProps> = () => {
  const samples = createDexieArrayQuery(() =>
    // Get all files in sample db
    AppStore.instance.sample.toCollection().keys(),
  );
  const [selectedIdx, setSelectedIdx] = createSignal<number | null>(null);
  return (
    <div class="sampleExplorer col-3" onMouseLeave={() => setSelectedIdx(null)}>
      <input id="fileExplorer" type="file" hidden />
      <div class="sampleExplorer-header relative">
        <span>Samples</span>
        <BiSolidFolderPlus class="icon" />
      </div>
      <div class="sampleExplorer-list">
        <For each={samples}>
          {(sample, i) => (
            <div
              classList={{
                'sampleExplorer-item relative': true,
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
              <span>{sample as string}</span>
              {i() === selectedIdx() && (
                <BiSolidTrash
                  class="icon"
                  onClick={async () =>
                    // TODO: use non-blocking modal
                    confirm(`Delete '${sample}' from sample bank?`) &&
                    AppStore.instance.sample
                      .where({ filename: sample })
                      .delete()
                  }
                />
              )}
            </div>
          )}
        </For>
      </div>
    </div>
  );
};
