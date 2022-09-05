import { useRef } from 'react';

export function usePersistFn<T extends (...args: any[]) => any>(fn: T): T {
  const fnRef = useRef<T | null>(fn);
  fnRef.current = fn;

  const persistRef = useRef<T | null>(null);

  if (!persistRef.current) {
    persistRef.current = ((...args) => fnRef.current?.(...args)) as T;
  }

  return persistRef.current;
}
