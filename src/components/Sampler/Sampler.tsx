import { Component } from 'solid-js';
import { ButtonPad, SampleEditor } from 'src/components';
import { SamplePlayer } from 'src/models/SamplePlayer';

import { useSelectedSampler } from '../../hooks/useSelectedSampler';
import style from './Sampler.module.css';

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
    <div class={style.sampler}>
      <SampleEditor />
      <div class={style.buttonGrid}>
        {props.samplers.map((x, i) => (
          <ButtonPad
            // Hide pads on smaller screens
            classList={{ [style['hide-md']]: i > 8 }}
            model={x}
            onClick={() => setSelectionIndex(i)}
          />
        ))}
      </div>
    </div>
  );
};
