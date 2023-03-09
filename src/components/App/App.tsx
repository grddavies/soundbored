import 'primeflex/primeflex.css';

import { BiLogosGithub, BiRegularHelpCircle } from 'solid-icons/bi';
import { createSignal, JSX } from 'solid-js';
import { HelpModal, Sampler } from 'src/components';
import { GlobalState } from 'src/store/AppState';
import { appInit } from 'src/utils';

import style from './App.module.css';

export function App(): JSX.Element {
  const appInitialized = appInit(); // Asyncronously load default samples
  // Display help modal
  const [showHelp, setShowHelp] = createSignal(true);
  return (
    <div class={style.root}>
      <HelpModal show={showHelp()} setShow={setShowHelp} />
      <header class={style.navbar}>
        <h1 class={style['header-title']}>SoundBored</h1>
        <ul>
          <li class={style.icon}>
            <a href="https://github.com/grddavies/soundbored">
              <BiLogosGithub size={36} />
            </a>
          </li>
          <li class={style.icon}>
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
      <main role="main" class={style.content}>
        <Sampler
          appInitialized={appInitialized}
          samplers={GlobalState.samplers}
        />
      </main>
      <footer class={style.footer} />
    </div>
  );
}
