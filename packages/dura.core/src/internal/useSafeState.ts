import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type MutableRefObject,
  type SetStateAction,
} from 'react';
import { usePersistFn } from './usePersistFn';

export function useUnmountedRef(): MutableRefObject<boolean> {
  const unmountedRef = useRef(false);
  useEffect(() => {
    unmountedRef.current = false;
    return () => {
      unmountedRef.current = true;
    };
  }, []);
  return unmountedRef;
}

export default function useSafeState<S>(
  initialState: S | (() => S),
): [S, Dispatch<SetStateAction<S>>] {
  const unmountedRef = useUnmountedRef();
  const [state, setState] = useState(initialState);
  const setCurrentState = usePersistFn((currentState) => {
    if (!unmountedRef.current) {
      setState(currentState);
    }
  });
  return [state, setCurrentState];
}
