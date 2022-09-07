import {
  combineReducers,
  compose,
  ReducersMapObject,
  StoreEnhancer,
} from "redux";
import { createImmerReducer } from "./create-immer-reducer";
import { __COMMIT__ } from "./internal/const";
import { produceWithPatches } from "immer";
import { createUseMount } from "./plugins/create-use-mount";
import { createUseState } from "./plugins/create-use-state";
import { createRestore } from "./plugins/create-restore";
import { createDefineFire } from "./plugins/create-define-fire";
import {
  Api,
  ConfigureOptions,
  CreateOptions,
  StoreEnhancerExt,
  StoreManager,
} from "./typings";

export function configure(
  configureOptions: ConfigureOptions
): StoreEnhancer<StoreEnhancerExt> {
  const GLOBAL_REDUCERS: ReducersMapObject = { __AK__: () => ({}) };

  return (next) => (reducer, initialState) => {
    const reduxStore = next(reducer, initialState);

    function create<S extends Object>(createOptions: CreateOptions<S>) {
      const { namespace } = createOptions;

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
          createOptions,
          storeManager: createStoreManager(),
        };
      }

      const api = createApi();

      const useMount = createUseMount(api);
      const useState = createUseState(api);
      const defineFire = createDefineFire(api);
      const restore = createRestore(api);

      return {
        namespace,
        initialState: createOptions.initialState,
        useState,
        defineFire,
        useMount,
        restore,
        getState: api.getState,
      };
    }

    return {
      ...reduxStore,
      create,
    };
  };
}
