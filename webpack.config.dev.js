// This is the webpack config to use during development.
// It enables the hot module replacement, the source maps and inline CSS styles.

import CopyWebpackPlugin from "copy-webpack-plugin"
import ErrorNotificationPlugin from "webpack-error-notification"
import path from "path"
import webpack from "webpack"

import writeAssets from "./src/server/write-assets"


const assetsPath = path.resolve(__dirname, "public")

const WEBPACK_HOST = process.env.HOST || "localhost"
const WEBPACK_PORT = parseInt(process.env.PORT) + 1 || 2031


module.exports = {
  // devtool: "eval", // Transformed code
  devtool: "source-map", // Original code
  entry: {
    "main": [
      `webpack-dev-server/client?http://${WEBPACK_HOST}:${WEBPACK_PORT}`,
      "webpack/hot/only-dev-server",
      "./src/client.jsx",
    ],
  },
  output: {
    path: assetsPath,
    filename: "[name]-bundle-[hash].js",
    publicPath: `http://${WEBPACK_HOST}:${WEBPACK_PORT}/`,
  },
  module: {
    loaders: [
      {
        exclude: /(node_modules|public)/,
        loader: "babel",
        query: {
          "plugins": [
            ["react-transform", {
              "transforms": [{
                "transform": "react-transform-hmr",
                "imports": ["react"],
                "locals": ["module"],
              }],
            }],
          ],
        },
        test: /\.(js|jsx)$/,
      }
    ],
  },
  resolve: {
    extensions: ["", ".js", ".jsx"],
  },
  progress: true,
  plugins: [
    // hot reload
    new webpack.HotModuleReplacementPlugin(),

    new webpack.NoErrorsPlugin(),

    // print a webpack progress
    new webpack.ProgressPlugin((percentage) => {
      if (percentage === 1) {
        process.stdout.write("Bundle is ready")
      }
    }),

    new ErrorNotificationPlugin(process.platform === "linux" && function(msg) {
      if (!this.lastBuildSucceeded) {
        require("child_process").exec("notify-send --hint=int:transient:1 Webpack " + msg)
      }
    }),

    new webpack.DefinePlugin({
      "process.env": {
        HOST: JSON.stringify(process.env.HOST),
        NODE_ENV: JSON.stringify("development"),
        API_URL: JSON.stringify(process.env.API_URL),
      },
    }),

    new webpack.ProvidePlugin({
      React: "react", // For babel JSX transformation which generates React.createElement.
    }),

    new CopyWebpackPlugin([
      {from: 'node_modules/bootstrap/dist', to: 'bootstrap'},
      {from: 'node_modules/highlight.js/styles', to: 'highlight.js-styles'}
    ]),

    function() { this.plugin("done", writeAssets(path.resolve(__dirname, "webpack-assets.json"))) },
  ],
}
