import { Component } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import { SamplerModel } from 'src/models';
import { SampleControls } from '../SampleControls/SampleControls';
import { SampleExplorer } from '../SampleExplorer/SampleExplorer';

import './SampleEditor.css';

type SampleEditorProps = {
  selectedSamplerIdx: number;
  samplers: SamplerModel[];
};

export const SampleEditor: Component<SampleEditorProps> = (props) => {
  const sampleEditors = props.samplers.map((model) => () => (
    <SampleControls model={model} />
  ));

  return (
    <div class="sampleEditor grid grid-nogutter">
      <SampleExplorer
        selectedSampler={props.samplers[props.selectedSamplerIdx]}
      />
      <Dynamic component={sampleEditors[props.selectedSamplerIdx]} />
    </div>
  );
};
