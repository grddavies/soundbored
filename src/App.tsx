import './App.css';
import { SoundControl } from './components';

function App() {
  /** Get some nice Zelda Samples from the net */
  const soundURL = (name: string) =>
    `https://noproblo.dayjo.org/ZeldaSounds/MC/${name}.wav`;
  return (
    <div class="App">
      <h1>SoundBored</h1>
      <div class="flex-grid">
        <div class="col">
          <SoundControl src={soundURL('MC_Link_Sword1')} label="Link 1" />
          <SoundControl src={soundURL('MC_Link_Sword2')} label="Link 2" />
          <SoundControl src={soundURL('MC_Link_Sword3')} label="Link 3" />
        </div>
        <div class="col">
          <SoundControl
            src={soundURL('MC_Link_Sword_Charge')}
            label="Sword Charge"
          />
          <SoundControl
            src={soundURL('MC_Link_Sword_Beam')}
            label="Sword Beam"
          />
          <SoundControl src={soundURL('MC_Crow')} label="Crow" />
        </div>
      </div>
    </div>
  );
}

export default App;
