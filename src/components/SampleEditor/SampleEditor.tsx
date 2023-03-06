import { Component } from 'solid-js';
import { SampleControls } from 'src/components/SampleControls/SampleControls';
import { SampleExplorer } from 'src/components/SampleExplorer/SampleExplorer';

import CSS from './SampleEditor.module.css';

/**
 * Renders an editor for the selected SamplePlayer
 *
 * NOTE: Requires SelectedSamplerProvider
 */
export const SampleEditor: Component = () => (
  <div class={`${CSS.sampleEditor} grid grid-nogutter`}>
    <SampleExplorer />
    <SampleControls />
  </div>
);
