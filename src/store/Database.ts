import Dexie from 'dexie';

import { TSample } from 'src/store/datatypes';

/**
 * Database
 *
 * Interface to IndexedDB database
 */
export class Database extends Dexie {
  // Tables - declared in constructor
  sample!: Dexie.Table<TSample, number>;

  constructor() {
    super('SoundBoardDB');
    this.version(1).stores({
      // Only declare attributes that we index on
      sample: 'filename',
    });
  }
}
