import './Sampler.css';

import { Component } from 'solid-js';
import { ButtonPad, SampleEditor } from 'src/components';
import { SamplePlayer } from 'src/models/SamplePlayer';

import { useSelectedSampler } from '../../hooks/useSelectedSampler';

type SamplerProps = {
  appInitialized: Promise<void>;
  samplers: SamplePlayer[];
};

/**
 * Renders a Sampler containing multiple SamplerPlayers
 */
export const Sampler: Component<SamplerProps> = (props) => {
  // Index of the selected sampler
  const { setSelectionIndex } = useSelectedSampler();
  return (
    <div class="Sampler">
      <SampleEditor />
      <div class="buttonGrid">
        {props.samplers.map((x, i) => (
          <ButtonPad
            // Hide pads on smaller screens
            classList={{ 'hide-md': i > 8 }}
            model={x}
            onClick={() => setSelectionIndex(i)}
          />
        ))}
      </div>
    </div>
  );
};
