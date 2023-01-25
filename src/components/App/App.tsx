import 'primeflex/primeflex.css';
import { createEffect, createSignal } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { AudioContextManager } from 'src/audio';

import { ButtonPad, Modal, ParamPanel, SampleExplorer } from 'src/components';
import { useAudioContext } from 'src/hooks';
import { SamplerModel } from 'src/models';
import { appInit } from 'src/utils';
import { Defaults } from 'src/utils/Defaults';

import './App.css';

const NUM_PADS = 12;

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
    samplers.forEach((model) => {
      model.audioContext.value = ctx;
      model.loadBuffer();
    });
  });

  // Initialise samplers
  const samplers = Array(NUM_PADS)
    .fill(null)
    .map(() => new SamplerModel());

  Defaults.samples.forEach(({ filename, label }, i) => {
    samplers[i].src.value = filename;
    samplers[i].label.value = label;
  });

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
            <div class="parameterPanel grid grid-nogutter">
              <SampleExplorer />
              <Dynamic component={paramPanels[selectedIdx()]} />
            </div>
          </div>
          <div class="col-12">
            <div class="grid grid-nogutter">
              {samplers.map((x, i) => (
                <div class="col-3">
                  <ButtonPad
                    model={x}
                    onClick={() => {
                      setSelectedIndex(i);
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
