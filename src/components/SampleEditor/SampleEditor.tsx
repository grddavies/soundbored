import { Component } from 'solid-js';
import { SampleControls } from 'src/components/SampleControls/SampleControls';
import { SampleExplorer } from 'src/components/SampleExplorer/SampleExplorer';

import style from './SampleEditor.module.css';

/**
 * Renders an editor for the selected SamplePlayer
 */
export const SampleEditor: Component = () => (
  <div class={`${style.sampleEditor} w-full flex`}>
    <SampleExplorer />
    <SampleControls />
  </div>
);
