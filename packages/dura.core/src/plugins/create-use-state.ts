import { useEffect, useRef } from "react";
import { Api } from "src/typings";
import { shallowEqual } from "../internal/shallowEqual";
import { useRender } from "../internal/useRender";

function useForceRenderSubscribe<S extends Object>(
  api: Api<S>,
  selector?: Function
) {
  const render = useRender();
  const currentState = useRef<Object>();

  function recording() {
    if (selector) {
      currentState.current = selector(api.getState());
    } else {
      currentState.current = api.getState();
    }
  }

  function subscribe() {
    /**
     * 如果取到的 currentState 是 undefined , 那么则说明该 reducer 节点已被卸载 , 因此不做渲染
     * 因为如果直接进行渲染，那么则可能导致一些使用该 reducer 节点的组件因为一些意外导致报错。
     */
    if (currentState.current) {
      const nextState = api.getState();
      if (selector) {
        if (!shallowEqual(selector(nextState), currentState.current)) {
          render();
        }
      } else {
        if (!shallowEqual(nextState, currentState.current)) {
          render();
        }
      }
    }
  }

  return { recording, subscribe, state: () => currentState.current };
}

export function createUseState<S extends Object>(api: Api<S>) {
  const {
    storeManager: { reduxStore, has, add, refresh },
  } = api;

  return function useState(selector?: Function) {
    const { subscribe, state, recording } = useForceRenderSubscribe(
      api,
      selector
    );

    /** 记录 */
    recording();

    useEffect(() => {
      subscribe();
      return reduxStore.subscribe(subscribe);
    }, []);

    return state();
  };
}
