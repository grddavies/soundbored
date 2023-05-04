import { BiSolidFolder, BiSolidFolderOpen } from 'solid-icons/bi';
import { TbWaveSawTool, TbWaveSine } from 'solid-icons/tb';
import { TbRadar2 } from 'solid-icons/tb';
import { VsRecord } from 'solid-icons/vs';
import { Component, createSignal, JSX, Match, Switch } from 'solid-js';

import { SampleControls } from '../SampleControls/SampleControls';
import { SampleExplorer } from '../SampleExplorer/SampleExplorer';
import styles from './ControlPanel.module.css';

const ControlPanelTabs = ['SAMPLE', 'EXPLORER', 'RECORD', 'EFFECT'] as const;

type ControlPanelTab = (typeof ControlPanelTabs)[number];

function TabIconFactory(
  tab: ControlPanelTab,
  active = false,
  size?: number,
): JSX.Element {
  switch (tab) {
    case 'SAMPLE':
      return active ? (
        <TbWaveSawTool size={size} />
      ) : (
        <TbWaveSine size={size} />
      );
    case 'EXPLORER':
      return active ? (
        <BiSolidFolderOpen size={size} />
      ) : (
        <BiSolidFolder size={size} />
      );
    case 'RECORD':
      return <VsRecord size={size} />;
    case 'EFFECT':
      return <TbRadar2 size={size} />;
  }
}

export const ControlPanel: Component = () => {
  const [activeTab, setActiveTab] = createSignal<ControlPanelTab>('SAMPLE');
  return (
    <div
      class={`${styles.controlPanel} w-full flex overflow-hidden surface-200 select-none border-1 border-primary border-round`}
    >
      <div class="w-2rem">
        <ul class="w-full h-full flex flex-initial flex-column justify-content-evenly list-none">
          {ControlPanelTabs.slice(0, 2).map((x, i) => (
            <li
              class={`flex-auto flex cursor-pointer border-50 border-right-1 ${
                i ? 'border-top-1' : ''
              } ${activeTab() === x ? 'surface-300' : 'surface-100'}`}
              onClick={() => setActiveTab(x)}
            >
              <a class="flex justify-content-center align-content-center flex-wrap w-full hover:text-primary transition-duration-200">
                {TabIconFactory(x, x === activeTab(), 24)}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div class="h-full flex-grow-1" style={{ width: 'calc(100% - 2rem)' }}>
        <Switch fallback={<span>Sorry, tab not implemented</span>}>
          <Match when={activeTab() === 'SAMPLE'}>
            <SampleControls />
          </Match>
          <Match when={activeTab() === 'EXPLORER'}>
            <SampleExplorer />
          </Match>
        </Switch>
      </div>
    </div>
  );
};
