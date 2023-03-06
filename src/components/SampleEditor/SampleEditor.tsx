import './SampleEditor.css';

import { Component } from 'solid-js';
import { SampleControls } from 'src/components/SampleControls/SampleControls';
import { SampleExplorer } from 'src/components/SampleExplorer/SampleExplorer';

/**
 * Renders an editor for the selected SamplePlayer
 *
 * NOTE: Requires SelectedSamplerProvider
 */
export const SampleEditor: Component = () => (
  <div class="sampleEditor grid grid-nogutter">
    <SampleExplorer />
    <SampleControls />
  </div>
);

