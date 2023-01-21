import { AudioContextManager } from 'src/audio';
import { useObservable } from './useObservable';

export function useAudioContext(): () => AudioContext | null {
  const [init] = useObservable(AudioContextManager.initialized);
  return () => (init() ? AudioContextManager.instance : null);
}
