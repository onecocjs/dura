import os from "node:os";
import { MacroError, MacroParams } from "babel-plugin-macros";

export function namespaceImportSpecifier(macro: MacroParams) {
  const { state, babel } = macro;

  const namespaceNodePaths = macro.references["namespace"];

  if (namespaceNodePaths.length > 1) {
    throw new MacroError(
      `namespace identifier can only be used once in a file`
    );
  }

  namespaceNodePaths.forEach((nodePath) => {
    if (!state.filename) {
      throw new MacroError(`why state.filename is undefined`);
    }

    const empty = "";

    const namespace = [new RegExp(state.cwd), /^\//, /\.(t|j)sx?$/].reduce(
      (memo, current) => memo.replace(current, empty),
      state.filename
    );

    nodePath.replaceWith(babel.types.stringLiteral(namespace));
  });
}
