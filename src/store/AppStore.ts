import Dexie from 'dexie';

interface ISample {
  filename: string;
  data: Blob;
}

export class AppStore extends Dexie {
  private static _instance: AppStore;

  public static get instance(): AppStore {
    if (!this._instance) {
      throw new Error('AppStore not Initialized');
    }
    return this._instance;
  }

  public static init() {
    this._instance = new AppStore();
  }

  // Tables - declared in constructor
  sample!: Dexie.Table<ISample, number>;

  constructor() {
    super('SoundBoardDB');
    this.version(1).stores({
      // NB: we don't declare blob attribute since we do not index it
      sample: 'filename',
    });
  }
}
