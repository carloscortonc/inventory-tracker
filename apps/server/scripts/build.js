/// <reference types="bun-types" />

// Get the list of dependencies to provide as external
const deps = await Bun.file("./package.json")
  .json()
  .then((p) => Object.keys(p.dependencies));

await Bun.build({
  entrypoints: ["./src/index.ts"],
  outdir: "./dist",
  external: deps,
  target: "node",
  banner: "#!/usr/bin/env node",
});
