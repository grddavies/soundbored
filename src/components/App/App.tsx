import 'primeflex/primeflex.css';

import { BiLogosGithub, BiRegularHelpCircle } from 'solid-icons/bi';
import { createSignal, JSX } from 'solid-js';
import { HelpModal, Sampler } from 'src/components';
import { AppStore } from 'src/store/AppState';
import { appInit } from 'src/utils';

import CSS from './App.module.css';

export function App(): JSX.Element {
  const appInitialized = appInit(); // Asyncronously load default samples
  // Display help modal
  const [showHelp, setShowHelp] = createSignal(true);
  const [store] = AppStore;
  return (
    <div class={CSS.root}>
      <HelpModal show={showHelp()} setShow={setShowHelp} />
      <header class={CSS.navbar}>
        <h1 class={CSS['header-title']}>SoundBored</h1>
        <ul>
          <li class={CSS.icon}>
            <a href="https://github.com/grddavies/soundbored">
              <BiLogosGithub size={36} />
            </a>
          </li>
          <li class={CSS.icon}>
            <a
              onClick={() => {
                setShowHelp(true);
              }}
            >
              <BiRegularHelpCircle size={36} />
            </a>
          </li>
        </ul>
      </header>
      <main role="main" class={CSS.content}>
        <Sampler appInitialized={appInitialized} samplers={store.samplers} />
      </main>
      <footer class={CSS.footer} />
    </div>
  );
}
