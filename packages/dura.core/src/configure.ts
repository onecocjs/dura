import {
  combineReducers,
  compose,
  ReducersMapObject,
  StoreEnhancer,
} from "redux";
import { createImmerReducer } from "./create-immer-reducer";
import { __COMMIT__ } from "./internal/const";
import { produceWithPatches } from "immer";

export function configure(
  configureOptions: ConfigureOptions,
  createDuraPlugins: CreateDuraPlugin[] = []
): StoreEnhancer<StoreEnhancerExt> {
  const GLOBAL_REDUCERS: ReducersMapObject = { __AK__: () => ({}) };

  return (next) => (reducer, initialState) => {
    const reduxStore = next(reducer, initialState);

    return {
      ...reduxStore,
      createAk: <S>(createAkOptions) => {
        const { namespace } = createAkOptions;

        function createStoreManager(): StoreManager<S> {
          const has = () => !!GLOBAL_REDUCERS[namespace];
          const del = () => void delete GLOBAL_REDUCERS[namespace];
          const add = () =>
            void (GLOBAL_REDUCERS[namespace] =
              createImmerReducer(createAkOptions));
          const refresh = () => {
            reduxStore.replaceReducer(
              compose(reducer, combineReducers(GLOBAL_REDUCERS))
            );
            reduxStore.dispatch({ type: ActionTypes.REFRESH });
          };
          return {
            has,
            del,
            add,
            refresh,
          };
        }

        function createApi(): Api<S> {
          const getCommitType = (funcName: string) =>
            [namespace, `${__COMMIT__}${funcName || "Anonymous"}`].join("/");
          const getState = () => reduxStore.getState()[namespace];
          const setState = (fn: Function) => {
            const state = getState();
            if (state) {
              const [, patches] = produceWithPatches((draft) => {
                fn(draft);
              })(state);
              const action = {
                type: getCommitType(fn.name),
                payload: {
                  patches,
                },
              };
              reduxStore.dispatch(action as never);
            }
          };
          return {
            configureOptions,
            setState,
            getState,
            createAkOptions,
            storeManager: createStoreManager(),
          };
        }

        const api = createApi();

        // TODO
        let returnR = {};
        return createDuraPlugins
          .map((createPlugin) => createPlugin(api)(returnR))
          .reduce(
            (memo, current) => ({ ...memo, [current.name]: current.handler }),
            {}
          );
      },
    };
  };
}
