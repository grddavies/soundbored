import { Disposable } from 'src/interfaces';
import { AppStore } from 'src/store';
import { Observable } from 'src/utils';

export class SamplerModel implements Disposable {
  public readonly src: Observable<string>;

  public readonly label: Observable<string>;

  public readonly audioContext = new Observable<AudioContext | null>(null);

  private _buffer = new Observable(new ArrayBuffer(0));

  private _audioBuffer?: AudioBuffer;

  private readonly _playbackRate = new Observable(1);

  private readonly _preservePitch = new Observable(false);

  private readonly onSrcUpdate = async (src: string) => {
    if (!src) {
      return;
    }
    const sample = await AppStore.instance.sample.get({
      filename: this.src.value,
    });

    if (!sample) {
      throw new Error(`Sample '${this.src.value}' not found`);
    }
    this._buffer.value = await sample.data.arrayBuffer();
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

  public get playbackRate(): Observable<number> {
    return this._playbackRate;
  }

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
