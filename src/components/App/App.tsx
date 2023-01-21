import { createEffect, createSignal } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import 'primeflex/primeflex.css';
import './App.css';
import {
  ControlPanel,
  ControlPanelCtx,
  SoundControl,
  SoundControlCtx,
} from 'src/components';
import { SoundControlModel, SoundControlModelCtx } from 'src/models';
import { Modal } from '../Modal/Modal';
import { appInit } from 'src/utils/appInit';

import freeJazz from 'src/assets/sounds/freejazz.wav';
import { useAudioContext } from 'src/hooks';

export function App() {
  const audioContext = useAudioContext();

  // load files on context load
  createEffect(async () => {
    const ctx = audioContext();
    if (!ctx) {
      return;
    }
    console.log('loadingData');
    await otherModels.forEach(async (model) => {
      await model.loadBuffer();
      await model.decodeBuffer(ctx);
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

  const otherModels = [0, 0, 0].map(
    (_, i) => new SoundControlModelCtx(freeJazz, i.toFixed()),
  );

  const controls = models.map((model) => () => <ControlPanel model={model} />);

  otherModels.forEach((x) =>
    controls.push(() => <ControlPanelCtx model={x} />),
  );

  const [index, setIndex] = createSignal(0);
  const [show, setShow] = createSignal(true);
  return (
    <>
      <Modal
        show={show()}
        onClose={() => {
          appInit();
          setShow(false);
        }}
        buttonText="Ok"
      >
        <div>Play audio by hitting the buttons</div>
      </Modal>
      <div class="App flex flex-column justify-content-center sm:w-full md:w-8">
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
              {otherModels.map((x, i) => (
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
