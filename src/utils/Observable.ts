import { Action } from 'src/utils/Action';
import { EqualityPredicate } from 'src/utils/Equality';

export class Observable<T> extends Action<T> {
  private _value: T;
  private readonly _eq: EqualityPredicate<T>;

  constructor(init: T, eq: EqualityPredicate<T> = Object.is) {
    super();
    this._value = init;
    this._eq = eq;
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
