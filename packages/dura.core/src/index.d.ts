// declare interface CreateAkReturn<S> {
//   namespace: string;
//   initialState: S;
//   useMount: (automatic?: boolean) => void;
//   useState: () => S;
//   getState: () => S;
//   defineFire: any;
//   restore: any;
// }

declare type CreateAkReturn<S, R extends CreateDuraPlugin[]> = R[number];

declare interface CreateAkOptions<S> {
  namespace: string;
  initialState: S;
}

declare interface CreateAk {
  <S, R extends CreateDuraPlugin[]>(
    createAkOptions: CreateAkOptions<S>,
    createDuraPlugins: R
  ): CreateAkReturn<S, R>;
}
declare interface StoreEnhancerExt {
  createAk: CreateAk;
}
declare interface ConfigureOptions {
  /**
   * @default true
   */
  UNSAFE_automatic?: boolean;
}

declare interface StoreManager<S> {
  has: () => boolean;
  del: () => void;
  add: () => void;
  refresh: () => void;
}

declare interface Api<S> {
  configureOptions: ConfigureOptions;
  setState: (fn: Function) => void;
  getState: () => S;
  createAkOptions: CreateAkOptions<S>;
  storeManager: StoreManager<S>;
}

// TODO
declare interface CreateDuraPlugin {
  <S, R>(api: Api<S>): (returnR: R) => any;
}
