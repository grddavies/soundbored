import 'primeflex/primeflex.css';
import { createEffect, createSignal } from 'solid-js';

import { ButtonPad, HelpModal, SampleEditor } from 'src/components';
import { NUM_PADS } from 'src/defaults/constants';
import { Defaults } from 'src/defaults/Defaults';
import { useAudioContext } from 'src/hooks';
import { SamplerModel } from 'src/models';
import { appInit } from 'src/utils';

import './App.css';

export function App() {
  const appInitialized = appInit(); // Asyncronously load default samples
  const audioContext = useAudioContext();

  // Load files on context load
  createEffect(() => {
    const ctx = audioContext(); // Reactive audio context
    if (!ctx) return;
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
      <HelpModal show={showHelp()} setShow={setShowHelp} />
      <div class="App">
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
