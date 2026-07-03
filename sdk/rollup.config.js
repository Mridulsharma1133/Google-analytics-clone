import resolve from "@rollup/plugin-node-resolve";
import terser  from "@rollup/plugin-terser";

export default {
  input: "src/index.js",
  output: [
    {
      file:    "dist/ga-sdk.esm.js",
      format:  "esm",
      exports: "named",
    },
    {
      file:    "dist/ga-sdk.umd.js",
      format:  "umd",
      name:    "GATracker",
      exports: "named",
      plugins: [terser()],
    },
  ],
  plugins: [resolve()],
};
