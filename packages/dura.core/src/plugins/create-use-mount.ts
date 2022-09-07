import { useEffect } from "react";
import { Api } from "../typings";
export function createUseMount<S>(api: Api<S>) {
  const { has, add, refresh } = api.storeManager;
  return function useMount() {
    !has() && add();
    useEffect(() => refresh(), []);
  };
}
