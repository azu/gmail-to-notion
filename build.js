// build.js
const { GasPlugin } = require("esbuild-gas-plugin");
// eslint-disable-next-line node/no-unpublished-require
require("esbuild")
  .build({
    entryPoints: ["src/index.ts"],
    bundle: true,
    target: "es2019",
    outfile: "dist/index.js",
    plugins: [GasPlugin],
    define: {
      "process.env.SEARCH_QUERY": JSON.stringify(process.env.SEARCH_QUERY),
      "process.env.NOTION_TOKEN": JSON.stringify(process.env.NOTION_TOKEN),
      "process.env.NOTION_DATABASE_ID": JSON.stringify(process.env.NOTION_DATABASE_ID),
      "process.env.NOTION_PROJECTS_ID": JSON.stringify(process.env.NOTION_PROJECTS_ID)
    }
  })
  // eslint-disable-next-line no-process-exit
  .catch(() => process.exit(1));
