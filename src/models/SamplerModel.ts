import { LABEL_CHAR_LIMIT } from 'src/defaults/constants';
import { AppStore } from 'src/store';
import { Observable } from 'src/utils';
import { getFilename } from 'src/utils/getFilename';

export class SamplerModel {
  public readonly src: Observable<string>;

  public readonly label: Observable<string>;

  public readonly audioContext = new Observable<AudioContext | null>(null);

  private _buffer = new Observable(new ArrayBuffer(0));

  private _audioBuffer?: AudioBuffer;

  private readonly _playbackRate = new Observable(1);

  private readonly _preservePitch = new Observable(false);

  private async updateBuffer(): Promise<void> {
    const data = await AppStore.instance.getSampleBlob(this.src.value);
    if (!data) {
      throw new Error(`Sample '${this.src.value}' not found`);
    }
    this._buffer.value = await data.arrayBuffer();
  }

  private readonly onSrcUpdate = async (src: string) => {
    this.label.value = getFilename(src).substring(0, LABEL_CHAR_LIMIT);
    if (!src) {
      return;
    }
    await this.updateBuffer();
  };

  private readonly onBufferUpdate = async () => {
    try {
      this._audioBuffer = await this.audioContext.value?.decodeAudioData(
        this._buffer.value,
      );
    } catch (error) {
      console.error(error);
    }
  };

  public get audioBuffer(): AudioBuffer {
    if (!this._audioBuffer) {
      throw new Error('No Audio Buffer loaded');
    }
    return this._audioBuffer;
  }

  constructor(src = '', label = '') {
    this.src = new Observable(src);
    this.label = new Observable(label);

    this.src.attach(this.onSrcUpdate);
    this._buffer.attach(this.onBufferUpdate);
  }

  /**
   * Has the sampler loaded an audio buffer
   */
  public get loaded(): boolean {
    return !!this._audioBuffer;
  }

  /**
   * Sampler layback rate parameter
   */
  public get playbackRate(): Observable<number> {
    return this._playbackRate;
  }

  /**
   * Sampler layback rate parameter
   */
  public get preservePitch(): Observable<boolean> {
    return this._preservePitch;
  }

  public dispose() {
    this.src.detach(this.onSrcUpdate);
  }

  public loadBuffer() {
    this.src.fire(this.src.value);
  }
}
