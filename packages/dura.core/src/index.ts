import { enablePatches, setAutoFreeze } from "immer";

setAutoFreeze(false);
enablePatches();
export * from "./configure";
