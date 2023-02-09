import { Observable } from 'src/utils';

export class AudioContextManager {
  private static _instance: AudioContext;

  public static get instance(): AudioContext {
    if (!this._instance) {
      throw new Error('AudioContext not initialized');
    }
    return this._instance;
  }

  public static initialized = new Observable(false);

  public static init(options?: AudioContextOptions) {
    this._instance = new AudioContext(options);
    this.initialized.value = true;
  }
}
