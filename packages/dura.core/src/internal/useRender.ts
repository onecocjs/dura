import { usePersistFn } from './usePersistFn';
import useSafeState from './useSafeState';

export function useRender() {
  const [, setCount] = useSafeState(0);
  return usePersistFn(() => setCount((count) => (count + 1) % 1_000_000));
}
