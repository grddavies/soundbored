import 'primeflex/primeflex.css';
import './App.css';

import { BiLogosGithub, BiRegularHelpCircle } from 'solid-icons/bi';
import { createSignal, JSX } from 'solid-js';
import { HelpModal, Sampler } from 'src/components';
import { appInit } from 'src/utils';

export function App(): JSX.Element {
  const appInitialized = appInit(); // Asyncronously load default samples
  // Display help modal
  const [showHelp, setShowHelp] = createSignal(true);
  return (
    <>
      <HelpModal show={showHelp()} setShow={setShowHelp} />
      <header class="navbar">
        <h1 class="header-title">SoundBored</h1>
        <ul>
          <li class="icon">
            <a href="https://github.com/grddavies/soundbored">
              <BiLogosGithub size={36} />
            </a>
          </li>
          <li class="icon">
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
      <main role="main" class="content">
        <Sampler appInitialized={appInitialized} />
      </main>
      <footer />
    </>
  );
}
