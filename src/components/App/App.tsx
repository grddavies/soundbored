import 'primeflex/primeflex.css';

import {
  BiLogosGithub,
  BiRegularCloudUpload,
  BiRegularHelpCircle,
} from 'solid-icons/bi';
import { createSignal, JSX } from 'solid-js';
import { HelpModal, Sampler } from 'src/components';
import { SampleStore } from 'src/samples';
import { GlobalState } from 'src/store/AppState';
import { appInit } from 'src/utils';

import style from './App.module.css';

export function App(): JSX.Element {
  const appInitialized = appInit(); // Asyncronously load default samples
  const [showHelp, setShowHelp] = createSignal(true); // Display help modal
  return (
    <div class={style.root}>
      <HelpModal show={showHelp()} setShow={setShowHelp} />
      <header class={style.navbar + ' px-4'}>
        <h1 class={style['header-title']}>SoundBored</h1>
        <ul class="flex gap-1">
          <li class={style.icon}>
            <button
              class={`${style.interaction} flex`}
              onClick={() => document.getElementById('fileExplorer')?.click()}
            >
              <BiRegularCloudUpload size={36} />
            </button>
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
                  // TODO: report action result in a toast msg
                }
              }}
            />
          </li>
          <li class={style.icon}>
            <button
              class={`${style.interaction} flex`}
              onClick={() => {
                setShowHelp(true);
              }}
            >
              <BiRegularHelpCircle size={36} />
            </button>
          </li>
          <li class={style.icon}>
            <a href="https://github.com/grddavies/soundbored">
              <BiLogosGithub size={36} />
            </a>
          </li>
        </ul>
      </header>
      <main
        role="main"
        class="flex flex-1 justify-content-center align-items-center"
      >
        <Sampler
          appInitialized={appInitialized}
          samplers={GlobalState.state.samplers}
        />
      </main>
      <footer class={style.footer} />
    </div>
  );
}
