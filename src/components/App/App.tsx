import 'primeflex/primeflex.css';
import { createEffect, createSignal } from 'solid-js';
import { AudioContextManager } from 'src/audio';

import { ButtonPad, Modal, SampleEditor, SampleExplorer } from 'src/components';
import { NUM_PADS } from 'src/defaults/constants';
import { useAudioContext } from 'src/hooks';
import { SamplerModel } from 'src/models';
import { appInit } from 'src/utils';
import { Defaults } from 'src/defaults/Defaults';

import './App.css';

export function App() {
  const appInitialized = appInit(); // Asyncronously load default samples
  const audioContext = useAudioContext();

  // load files on context load
  createEffect(() => {
    // Add our reactive AudioContext
    const ctx = audioContext();
    if (!ctx) {
      return;
    }
    samplers.forEach(async (model) => {
      model.audioContext.value = ctx;
      await appInitialized;
      model.loadBuffer();
    });
  });

  // Initialise samplers
  const samplers = Defaults.samples
    .slice(0, NUM_PADS)
    .map(({ filename, label }) => new SamplerModel(filename, label));

  // Index of the selected sampler
  const [selectedIdx, setSelectedIndex] = createSignal(0);
  // Display help modal
  const [showHelp, setShowHelp] = createSignal(true);

  return (
    <>
      <Modal
        show={showHelp()}
        onClose={() => {
          if (!AudioContextManager.initialized.value) {
            AudioContextManager.init();
          }
          setShowHelp(false);
        }}
        buttonText="Ok"
      >
        <div class="grid">
          <div class="col">
            <h1>Help</h1>
            <div class="text-left">
              <div class="py-2">Trigger samples by hitting the pads</div>
              <div class="py-2">Load new sounds from the sample explorer</div>
              <div class="py-2">Record and upload your own samples</div>
            </div>
          </div>
        </div>
      </Modal>
      <div class="App">
        <h1>SoundBored</h1>
        <SampleEditor samplers={samplers} selectedSamplerIdx={selectedIdx()} />
        <div class="buttonGrid">
          {samplers.map((x, i) => (
            <ButtonPad
              model={x}
              onClick={() => {
                setSelectedIndex(i);
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}
