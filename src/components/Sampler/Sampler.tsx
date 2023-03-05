import './Sampler.css';

import { Component, createEffect, createSignal } from 'solid-js';
import { AudioCtx } from 'src/audio';
import { ButtonPad, SampleEditor } from 'src/components';
import { NUM_PADS } from 'src/defaults/constants';
import { Defaults } from 'src/defaults/Defaults';
import { SamplerModel } from 'src/models';

type SamplerProps = {
  appInitialized: Promise<void>;
};

export const Sampler: Component<SamplerProps> = (props) => {
  // Load files on context load
  createEffect(() => {
    const ctx = AudioCtx(); // Reactive audio context
    if (!ctx) return;
    samplers.forEach(async (model) => {
      model.audioContext.value = ctx;
      await props.appInitialized;
      model.loadBuffer();
    });
  });

  // Initialise samplers
  const samplers = Defaults.samples
    .slice(0, NUM_PADS)
    .map(({ filename, label }) => new SamplerModel(filename, label));

  // Index of the selected sampler
  const [selectedIdx, setSelectedIndex] = createSignal(0);
  return (
    <div class="Sampler">
      <SampleEditor selectedSampler={samplers[selectedIdx()]} />
      <div class="buttonGrid">
        {samplers.map((x, i) => (
          <ButtonPad
            // Hide pads on smaller screens
            classList={{ 'hide-md': i > 8 }}
            model={x}
            onClick={() => {
              setSelectedIndex(i);
            }}
          />
        ))}
      </div>
    </div>
  );
};
