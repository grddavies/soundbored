export type UpdateCallback<T> = (value: T, old?: T) => void;

export class Action<T = void> {
  /** Bound callbacks to fire on update change */
  private _bindings: UpdateCallback<T>[] = [];

  public attach(...callbacks: UpdateCallback<T>[]) {
    this._bindings.push(...callbacks);
  }

  public detach(...callbacks: UpdateCallback<T>[]) {
    this._bindings = this._bindings.filter((fn) => !callbacks.includes(fn));
  }

  public fire(current: T, old?: T) {
    this._bindings.forEach((fn) => {
      fn(current, old);
    });
  }
}
