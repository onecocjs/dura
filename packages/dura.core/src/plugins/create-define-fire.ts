import { Api } from "src/typings";

export function createDefineFire<S extends Object>(api: Api<S>) {
  return (fn: Function) =>
    async (...args: unknown[]) => {
      try {
        return await fn(api.setState, api.getState)(...args);
      } catch (error) {
        if (!api.configureOptions.onError) {
          throw error;
        }
        api.configureOptions.onError?.(error);
      }
    };
}
