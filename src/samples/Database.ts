import Dexie from 'dexie';
import { Sample } from 'src/models/Sample';

/**
 * Database
 *
 * Interface to IndexedDB database
 */
export class Database extends Dexie {
  // Tables - declared in constructor
  sample!: Dexie.Table<Sample, number>;

  constructor() {
    super('SoundBoardDB');
    this.version(1).stores({
      // Only declare attributes that we index on
      sample: 'filename',
    });
  }
}
