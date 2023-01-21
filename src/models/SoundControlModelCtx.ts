import { Observable } from 'src/utils';

export class SoundControlModelCtx {
  public readonly src = new Observable('');

  public readonly label?: string;

  private _buffer: ArrayBuffer | null = null;

  private _audioBuffer: AudioBuffer | null = null;

  private readonly _playbackRate = new Observable(1);

  private readonly _preservePitch = new Observable(false);

  public async loadBuffer() {
    await fetch(this.src.value)
      .then((data) => data.arrayBuffer())
      .then((buf) => {
        this._buffer = buf;
      })
      .catch((e) => console.log(e));
  }

  public async decodeBuffer(ctx: AudioContext) {
    if (!this._buffer) {
      throw new Error('No buffer loaded');
    }
    this._audioBuffer = await ctx.decodeAudioData(this._buffer);
  }

  public get audioBuffer(): AudioBuffer {
    if (!this._audioBuffer) {
      throw new Error('No Audio Buffer loaded');
    }
    return this._audioBuffer;
  }

  constructor(src = '', label?: string) {
    this.src.value = src;
    this.label = label;
  }

  public get playbackRate(): Observable<number> {
    return this._playbackRate;
  }

  public get preservePitch(): Observable<boolean> {
    return this._preservePitch;
  }
}
