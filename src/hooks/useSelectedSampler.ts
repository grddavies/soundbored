import { Accessor, createSignal, Setter } from 'solid-js';
import { produce } from 'solid-js/store';
import { SamplePlayer } from 'src/models/SamplePlayer';
import { AppStore } from 'src/store/AppState';

type MutateSamplerAction = (sampler: SamplePlayer) => void;

interface SelectedSamplePlayerModel {
  selected: Accessor<SamplePlayer>;
  setSelectionIndex: Setter<number>;
  mutateSelected: (fn: MutateSamplerAction) => void;
}

const [idx, setSelectionIndex] = createSignal(0);
const [state, setState] = AppStore;
const selected = (): SamplePlayer => state.samplers[idx()];
const mutateSelected = (fn: MutateSamplerAction): void => {
  setState('samplers', idx(), produce(fn));
};

const model: SelectedSamplePlayerModel = {
  selected,
  setSelectionIndex,
  mutateSelected,
};

/**
 * Provides access to the selected SamplePlayer and utilities to modify it
 */
export const useSelectedSampler = (): SelectedSamplePlayerModel => model;
/**
 * Provides readonly access to the selected SamplePlayer
 */
export const useSelectedSamplerReadonly = (): Pick<
  SelectedSamplePlayerModel,
  'selected'
> => model;
