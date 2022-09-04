import type { StoreEnhancer } from "redux";

export interface CreateAkReturn {
  namespace: string;
  initialState: any;
  useMount: (automatic?: boolean) => void;
  useState: () => any;
  getState: any;
  defineFire: any;
  restore: any;
}

export interface CreateAk {
  (): void;
}

export interface StoreEnhancerExt {
  createAk: any;
}

export interface ConfigureOptions {
  /**
   * @default true
   */
  UNSAFE_automatic?: boolean;
}

export function configure(
  configureOptions: ConfigureOptions
): StoreEnhancer<StoreEnhancerExt> {
  return (next) => (reducer, initialState) => {
    const reduxStore = next(reducer, initialState);

    return { ...reduxStore, createAk: {} };
  };
}
