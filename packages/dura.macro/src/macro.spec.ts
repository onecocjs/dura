import plugin from "babel-plugin-macros";
import pluginTester from "babel-plugin-tester";

pluginTester({
  plugin,
  babelOptions: { filename: __filename },
  tests: {
    "dura.macro does not support default import": {
      code: `
          import configure from "./macro";
        `,
      error: "dura.macro does not support default import",
    },
    "namespace identifier can only be used once in a file": {
      code: `
        import { namespace } from "./macro";
        console.log(namespace);
        console.log(namespace);
      `,
      error: "namespace identifier can only be used once in a file",
    },
    "namespace replaceWith state filename": {
      code: `
        import { namespace,a } from "./macro";
        console.log( namespace );
      `,
      output: `
        console.log("packages/dura.macro/src/macro.spec");
      `,
    },
  },
});
