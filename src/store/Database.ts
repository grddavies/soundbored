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
      // NB: we don't declare blob attribute since we do not index it
      sample: 'filename',
    });
  }
}
