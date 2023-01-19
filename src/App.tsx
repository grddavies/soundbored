import { createSignal } from 'solid-js';
import { Dynamic, Index } from 'solid-js/web';
import './App.css';
import { ControlPanel, SoundControl } from './components';
import { SoundControlModel } from './components/SoundControlModel';

function App() {
  /** Get some nice Zelda Samples from the net */
  const soundURL = (name: string) =>
    `https://noproblo.dayjo.org/ZeldaSounds/MC/${name}.wav`;

  const sounds = [
    { file: 'MC_Link_Sword1', label: 'Link 1' },
    { file: 'MC_Link_Sword2', label: 'Link 2' },
    { file: 'MC_Link_Sword3', label: 'Link 3' },
    { file: 'MC_Link_Sword_Charge', label: 'Sword Charge' },
    { file: 'MC_Link_Sword_Beam', label: 'Sword Beam' },
    { file: 'MC_Crow', label: 'Crow' },
  ];

  const models = sounds.map(
    ({ file, label }) => new SoundControlModel(soundURL(file), label),
  );

  const controls = models.map((model) => () => <ControlPanel model={model} />);

  const [index, setIndex] = createSignal(0);
  return (
    <div class="App">
      <h1>SoundBored</h1>
      <div class="flex-grid">
        <div class="col">
          <Dynamic component={controls[index()]} />
        </div>
      </div>
      <div class="flex-grid">
        <div class="col">
          <Index each={[0, 1, 2]}>
            {(i) => (
              <SoundControl
                model={models[i()]}
                onClick={() => {
                  setIndex(i);
                }}
              />
            )}
          </Index>
        </div>
        <div class="col">
          <Index each={[3, 4, 5]}>
            {(i) => (
              <SoundControl
                model={models[i()]}
                onClick={() => {
                  setIndex(i);
                }}
              />
            )}
          </Index>
        </div>
      </div>
    </div>
  );
}

export default App;
