import { Observable, ObservableReadonly } from '../Observable';

export class SoundControlModel {
  public readonly src: string;

  public readonly label?: string;

  private readonly _playbackRate = new Observable(1);

  private readonly _preservePitch = new Observable(false);

  constructor(src: string, label?: string) {
    this.src = src;
    this.label = label;
  }

  public get playbackRate(): Observable<number> {
    return this._playbackRate;
  }

  public get preservePitch(): Observable<boolean> {
    return this._preservePitch;
  }
}
