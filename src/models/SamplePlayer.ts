import { LABEL_CHAR_LIMIT } from 'src/defaults/constants';
import { getFilename } from 'src/samples';

import { Camera2D, defaultCamera2D } from './Camera2D';

/**
 * A Sample Player
 */
export type SamplePlayer = {
  /**
   * The source of the loaded sample in the database
   */
  src: string;
  /**
   * The human-readable label for this SamplePlayer
   */
  label: string;
  /**
   * The playback rate for the current sample
   */
  playbackRate: number;
  /**
   * The waveform viewport camera position
   */
  camera: Camera2D;
};

/**
 * SerializedSamplePlayer
 *
 * The SamplePlayer attributes we de/serialize
 */
export type SerializedSamplePlayer = Omit<SamplePlayer, 'camera'> & {
  camera: undefined;
};

/**
 * Update a SamplePlayer's src and label
 * @param model
 * @param src
 */
export function updateSampleSrc(model: SamplePlayer, src: string): void {
  model.src = src;
  model.label = getFilename(src).substring(0, LABEL_CHAR_LIMIT);
  model.camera = defaultCamera2D();
}
