import { EqualityPredicate } from './Equality';

export type UpdateCallback<T> = (value: T, old?: T) => void;

export class Observable<T> {
  private _value: T;
  private readonly _eq: EqualityPredicate<T>;

  /** Bound callbacks to fire on update change */
  private _bindings: UpdateCallback<T>[] = [];

  constructor(init: T, eq: EqualityPredicate<T> = Object.is) {
    this._value = init;
    this._eq = eq;
  }

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

  public get value(): T {
    return this._value;
  }

  public set value(value: T) {
    if (!this._eq(this._value, value)) {
      const old = this._value;
      this._value = value;
      this.fire(value, old);
    }
  }
}

export type ObservableReadonly<T> = Pick<
  Observable<T>,
  'value' | 'attach' | 'detach'
>;
