import { LABEL_CHAR_LIMIT } from 'src/defaults/constants';
import { getFilename } from 'src/samples';

/**
 * A sample player
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
};

/**
 * Update a SamplePlayer's src and label
 * @param model
 * @param src
 */
export function updateSampleSrc(model: SamplePlayer, src: string): void {
  model.src = src;
  model.label = getFilename(src).substring(0, LABEL_CHAR_LIMIT);
}
