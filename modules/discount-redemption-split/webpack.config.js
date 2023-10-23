// import webpack from  'webpack';
import path from "node:path";

import * as url from "node:url";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

/**
 *
 * @param environment
 * @param argv
 */
export default function config(environment, argv) {
  const production = argv.mode === "production";
  return {
    mode: production ? "production" : "development",
    devtool: "cheap-source-map",
    entry: path.resolve(__dirname, "./src/index.js"),
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "split-activity.js",
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: "babel-loader",
        },
      ],
    },
    plugins: [],
  };
}
