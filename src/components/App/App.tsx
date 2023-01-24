import 'primeflex/primeflex.css';
import { createEffect, createSignal } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { AudioContextManager } from 'src/audio';

import {
  ControlPanel,
  ControlPanelCtx,
  Modal,
  SoundControl,
  SoundControlCtx,
} from 'src/components';
import { useAudioContext } from 'src/hooks';
import { SoundControlModel, SoundControlModelCtx } from 'src/models';
import { appInit } from 'src/utils';

import './App.css';

export function App() {
  appInit(); // Asyncronously load default samples
  const audioContext = useAudioContext();

  // load files on context load
  createEffect(() => {
    // Add our reactive AudioContext
    const ctx = audioContext();
    if (!ctx) {
      return;
    }
    newModels.forEach((model) => {
      model.audioContext.value = ctx;
      model.loadBuffer();
    });
  });

  /** Get some nice Zelda Samples from the net */
  const soundURL = (name: string) =>
    `https://noproblo.dayjo.org/ZeldaSounds/MC/${name}.wav`;

  const sounds = [
    { file: 'MC_Link_Sword1', label: 'Link 1' },
    { file: 'MC_Link_Sword2', label: 'Link 2' },
    { file: 'MC_Link_Sword3', label: 'Link 3' },
    { file: 'MC_Link_Sword_Charge', label: 'Sword Charge' },
    { file: 'MC_Link_Sword_Beam', label: 'Sword Beam' },
    { file: 'MC_Crow', label: 'Crow' },
    { file: 'MC_Ezlo1', label: 'Ezlo 1' },
    { file: 'MC_Ezlo2', label: 'Ezlo 2' },
    { file: 'MC_Ezlo3', label: 'Ezlo 3' },
  ];

  const models = sounds.map(
    ({ file, label }) => new SoundControlModel(soundURL(file), label),
  );

  const controls = models.map((model) => () => <ControlPanel model={model} />);

  // TEMP hack using web audio api - remove once file upload implemented
  const newModels = ['freejazz.wav', 'AUUGHHH.mp3', 'scratch.wav'].map(
    (filename) => new SoundControlModelCtx(filename, filename.split('.').at(0)),
  );
  newModels.forEach((x) => controls.push(() => <ControlPanelCtx model={x} />));

  // Index of the selected
  const [index, setIndex] = createSignal(0);
  // Display help modal
  const [showHelp, setShowHelp] = createSignal(true);
  return (
    <>
      <Modal
        show={showHelp()}
        onClose={() => {
          AudioContextManager.init();
          setShowHelp(false);
        }}
        buttonText="Ok"
      >
        <div>Play audio by hitting the buttons</div>
      </Modal>
      <div class="App flex flex-column justify-content-center">
        <div class="grid">
          <h1 class="col-12">SoundBored</h1>
          <div class="col-12">
            <Dynamic component={controls[index()]} />
          </div>
          <div class="col-12">
            <div class="grid grid-nogutter">
              {models.map((x, i) => (
                <div class="col-3">
                  <SoundControl
                    model={x}
                    onClick={() => {
                      setIndex(i);
                    }}
                  />
                </div>
              ))}
              {newModels.map((x, i) => (
                <div class="col-3">
                  <SoundControlCtx
                    model={x}
                    onClick={() => {
                      setIndex(9 + i);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
