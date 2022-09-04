import { createMacro } from "babel-plugin-macros";

import { importDefaultSpecifierHandler } from "./plugins/import-default-specifier";
import { namespaceImportSpecifier } from "./plugins/namespace-import-specifier";

export default createMacro((macro) => {
  [importDefaultSpecifierHandler, namespaceImportSpecifier].forEach((p) =>
    p(macro)
  );
});
