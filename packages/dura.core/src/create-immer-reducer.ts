import { Action, Reducer } from "redux";
import { Patch, applyPatches } from "immer";
import { __COMMIT__, RESTORE } from "./internal/const";
import { CreateOptions } from "./typings";
export interface AkAction extends Action<string> {
  payload?: {
    patches?: Patch[];
  };
}

export function createImmerReducer<S extends Object>(
  options: CreateOptions<S>
): Reducer<S> {
  function immerReducer(state: S = options.initialState, action: AkAction) {
    const namespaceSplit = action?.type?.split?.("/");
    const $name = namespaceSplit.pop();
    const $namespace = namespaceSplit.join("/");

    if ($namespace !== options.namespace) {
      return state;
    }

    if ($name.startsWith(__COMMIT__)) {
      const nextState = applyPatches(state, action?.payload?.patches ?? []);
      return nextState;
    }

    if ($name.startsWith(RESTORE)) {
      return options.initialState;
    }

    return state;
  }

  return immerReducer;
}
