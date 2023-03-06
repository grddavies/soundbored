import { createStore } from 'solid-js/store';
import { NUM_PADS } from 'src/defaults/constants';
import { Defaults } from 'src/defaults/Defaults';
import { SamplePlayer } from 'src/models/SamplePlayer';

const LOCAL_STORAGE_KEY = 'soundbored-app';

/**
 * Global Application state
 */
export type AppState = {
  samplers: SamplePlayer[];
};

/**
 * Restore AppState from local storage
 * @returns Parsed app state or null
 */
function restoreFromLocalStorage(): AppState | null {
  const jsonString = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (jsonString) {
    const state: unknown = JSON.parse(jsonString);
    if (!!state && typeof state === 'object' && 'samplers' in state) {
      return state as AppState;
    }
    console.error(`InvalidAppState '${jsonString}'`);
  }
  console.info('No app state in local storage');
  return null;
}

/**
 * Set the initial state
 * @returns
 */
function initialiseState(): AppState {
  // Initialise samplers
  const samplers = Defaults.samples.slice(0, NUM_PADS).map(
    ({ filename, label }): SamplePlayer => ({
      src: filename,
      label,
      playbackRate: 1,
    }),
  );
  return { samplers };
}

const initState: AppState = restoreFromLocalStorage() ?? initialiseState();

/**
 * Global application store object and setter function
 */
export const [GlobalState, setGlobalState] = createStore<AppState>(initState);

/**
 * Write the global application state to localStorage
 */
export function persistGlobalState(): void {
  console.log('Global State Written');
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(GlobalState));
}

