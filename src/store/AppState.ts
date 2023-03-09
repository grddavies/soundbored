import { createStore } from 'solid-js/store';
import { NUM_PADS } from 'src/defaults/constants';
import { Defaults } from 'src/defaults/Defaults';
import { SamplePlayer } from 'src/models/SamplePlayer';

import { Convert } from './Convert';

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
    try {
      return Convert.toAppState(jsonString);
    } catch (e) {
      console.error(e);
      return null;
    }
  }
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
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(GlobalState));
}

