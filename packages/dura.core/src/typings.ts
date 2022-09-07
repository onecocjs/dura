export interface ConfigureOptions {
  /**
   * @default true
   */
  UNSAFE_automatic?: boolean;

  onError?: (error: Error) => void;
}

export type FireFnArgs<F extends Function> = (setState, getState) => F;

export type CreateFn = <S>(options: CreateOptions<S>) => {
  useMount: (automatic?: boolean) => void;
  useState: () => S;
  restore: () => void;
  defineFire: <F extends Function>(fire: FireFnArgs<F>) => void;
};

export interface StoreEnhancerExt {
  create: CreateFn;
}

export interface CreateOptions<S> {
  namespace: string;
  initialState: S;
}

export interface StoreManager<S> {
  has: () => boolean;
  del: () => void;
  add: () => void;
  refresh: () => void;
  reduxStore: import("redux").Store;
}

export interface Api<S> {
  configureOptions: ConfigureOptions;
  setState: (fn: Function) => void;
  getState: () => S;
  createOptions: CreateOptions<S>;
  storeManager: StoreManager<S>;
}
