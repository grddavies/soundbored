import { unmute } from 'src/audio/unmute';
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

  public static init(options?: AudioContextOptions): void {
    this._instance = new AudioContext(options);
    unmute(this._instance);
    this.initialized.value = true;
  }

  private constructor() {
    // Singleton
  }
}
