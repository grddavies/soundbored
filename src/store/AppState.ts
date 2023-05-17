import { createStore } from 'solid-js/store';
import { NUM_PADS } from 'src/defaults/constants';
import { Defaults } from 'src/defaults/Defaults';
import { defaultCamera2D } from 'src/models';
import { SamplePlayer, SerializedSamplePlayer } from 'src/models/SamplePlayer';
import { Logger } from 'src/utils/Logger';

import { Convert } from './Convert';

const LOCAL_STORAGE_KEY = 'soundbored-app';

/**
 * Serialized Global Application state
 */
export type SerializedAppState = {
  samplers: SerializedSamplePlayer[];
};

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
      const { samplers } = Convert.toAppState(jsonString);
      return {
        samplers: samplers.map((x) => ({ ...x, camera: defaultCamera2D() })),
      };
    } catch (e) {
      Logger.error('Failed to parse App state from JSON', e);
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
      camera: defaultCamera2D(),
    }),
  );
  return { samplers };
}

const initState: AppState = restoreFromLocalStorage() ?? initialiseState();

/**
 * Global application store object and setter function
 */
export const [GlobalState, setGlobalState] = createStore<AppState>(initState);

const writeAppState: (value: SerializedAppState) => string = JSON.stringify;

/**
 * Write the global application state to localStorage
 */
export function persistGlobalState(): void {
  const { samplers } = GlobalState;
  localStorage.setItem(
    LOCAL_STORAGE_KEY,
    writeAppState({
      samplers: samplers.map((x) => ({ ...x, camera: undefined })),
    }),
  );
}
