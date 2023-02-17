import { Accessor, createSignal, onCleanup, onMount, Setter } from 'solid-js';
import { Observable, ObservableReadonly } from 'src/utils';

export function useObservable<T>(
  observable: Observable<T>,
): [Accessor<T>, Setter<T>];
export function useObservable<T>(
  observable: ObservableReadonly<T>,
): [Accessor<T>];
export function useObservable<T>(
  observable: Observable<T> | ObservableReadonly<T>,
): [Accessor<T>, (v: T) => void] | [Accessor<T>] {
  const [signal, setSignal] = createSignal(observable.value);
  const updateFunc = (v: T): void => {
    setSignal(() => v);
  };

  onMount(() => {
    observable.attach(updateFunc);
  });

  onCleanup(() => {
    observable.detach(updateFunc);
  });

  const setValue = (value: T): void => {
    observable.value = value;
  };

  return [signal, setValue];
}
