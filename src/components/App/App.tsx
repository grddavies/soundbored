import 'primeflex/primeflex.css';
import { createEffect, createSignal } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { AudioContextManager } from 'src/audio';

import { ButtonPad, Modal, ParamPanel, SampleExplorer } from 'src/components';
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

  const paramPanels = samplers.map((model) => () => (
    <ParamPanel model={model} />
  ));

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
            <ul class="text-left">
              <li>Play sounds by hitting the pads</li>
              <li>Edit sounds in the control panel</li>
              <li>Load new sounds from the sample explorer</li>
              <li>Upload your own sounds</li>
              <li>Rename pads via the control panel</li>
            </ul>
          </div>
        </div>
      </Modal>
      <div class="App">
        <h1>SoundBored</h1>
        <div class="parameterPanel grid grid-nogutter">
          <SampleExplorer selectedSampler={samplers[selectedIdx()]} />
          <Dynamic component={paramPanels[selectedIdx()]} />
        </div>
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
