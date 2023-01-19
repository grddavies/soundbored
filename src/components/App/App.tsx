import { createSignal } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import 'primeflex/primeflex.css';
import './App.css';
import { ControlPanel, SoundControl } from 'src/components';
import { SoundControlModel } from 'src/models';

export function App() {
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
    { file: 'MC_Ezlo1', label: 'Ezlo 1' },
    { file: 'MC_Ezlo2', label: 'Ezlo 2' },
    { file: 'MC_Ezlo3', label: 'Ezlo 3' },
  ];

  const models = sounds.map(
    ({ file, label }) => new SoundControlModel(soundURL(file), label),
  );

  const controls = models.map((model) => () => <ControlPanel model={model} />);

  const [index, setIndex] = createSignal(0);
  return (
    <div class="App flex flex-column justify-content-center sm:w-full md:w-8">
      <div class="grid">
        <h1 class="col-12">SoundBored</h1>
        <div class="col-12">
          <Dynamic component={controls[index()]} />
        </div>
        <div class="col-12">
          <div class="grid grid-nogutter">
            {models.map((x, i) => (
              <div class="col-4">
                <SoundControl
                  model={x}
                  onClick={() => {
                    setIndex(i);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
