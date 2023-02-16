import { Component } from 'solid-js';

import { SamplerModel } from 'src/models';
import { SampleControls } from '../SampleControls/SampleControls';
import { SampleExplorer } from '../SampleExplorer/SampleExplorer';

import './SampleEditor.css';

type SampleEditorProps = {
  selectedSampler: SamplerModel;
};

export const SampleEditor: Component<SampleEditorProps> = (props) => (
  <div class="sampleEditor grid grid-nogutter">
    <SampleExplorer selectedSampler={props.selectedSampler} />
    <SampleControls model={props.selectedSampler} />
  </div>
);
