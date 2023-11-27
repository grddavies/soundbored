import { Accessor, createSignal, Setter } from 'solid-js';
import { produce } from 'solid-js/store';
import { SamplePlayer } from 'src/models/SamplePlayer';
import { GlobalState } from 'src/store/AppState';

type MutateSamplerAction = (sampler: SamplePlayer) => void;

/**
 * # SelectedSamplePlayerModel
 *
 * Interface to the globally selected SamplePlayer
 */
interface SelectedSamplePlayerModel {
  /**
   * The current globally selected SamplePlayer
   */
  selected: Accessor<SamplePlayer>;
  /**
   * The index of the globally selected SamplePlayer
   */
  selectedIdx: Accessor<number>;
  /**
   * Set the index of the selected SamplePlayer in the SamplePlayers array
   */
  setSelectionIndex: Setter<number>;
  /**
   * Higher order function that takes a function to modify the state of the
   * selected sampler as an argument
   *
   * @param fn - Function to mutate the selected sampler
   * @returns
   */
  mutateSelected: (fn: MutateSamplerAction) => void;
}

const [selectedIdx, setSelectionIndex] = createSignal(0);
const selected = (): SamplePlayer => GlobalState.state.samplers[selectedIdx()];
const mutateSelected = (fn: MutateSamplerAction): void => {
  GlobalState.setState('samplers', selectedIdx(), produce(fn));
};

const model: SelectedSamplePlayerModel = {
  selected,
  selectedIdx,
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
