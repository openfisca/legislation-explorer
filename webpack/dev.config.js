// This is the webpack config to use during development.
// It enables the hot module replacement, the source maps and inline CSS styles.

import ErrorNotificationPlugin from "webpack-error-notification";
import path from "path";
import webpack from "webpack";

const assetsPath = path.resolve(__dirname, "../public/assets");
import notifyStats from "./utils/notify-stats";
import writeStats from "./utils/write-stats";

const WEBPACK_HOST = "localhost";
const WEBPACK_PORT = parseInt(process.env.PORT) + 1 || 2031;


export default {
  devtool: "eval",
  entry: {
    "main": [
      `webpack-dev-server/client?http://${WEBPACK_HOST}:${WEBPACK_PORT}`,
      "webpack/hot/only-dev-server",
      "./src/client.js"
    ]
  },
  output: {
    path: assetsPath,
    filename: "[name]-[chunkhash].js",
    chunkFilename: "[name]-[chunkhash].js",
    publicPath: `http://${WEBPACK_HOST}:${WEBPACK_PORT}/assets/`
  },
  module: {
    loaders: [
      {
        exclude: /node_modules/,
        loaders: ["react-hot", "babel"],
        test: /\.jsx?$/,
      },
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  progress: true,
  plugins: [

    // hot reload
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),

    // print a webpack progress
    new webpack.ProgressPlugin((percentage, message) => {
      const MOVE_LEFT = new Buffer("1b5b3130303044", "hex").toString();
      const CLEAR_LINE = new Buffer("1b5b304b", "hex").toString();
      process.stdout.write(`${CLEAR_LINE}${Math.round(percentage * 100)}%: ${message}${MOVE_LEFT}`);
    }),

    new ErrorNotificationPlugin(process.platform === 'linux' && function(msg) {
      if (!this.lastBuildSucceeded) {
        require('child_process').exec('notify-send --hint=int:transient:1 Webpack ' + msg);
      }
    }),

    new webpack.DefinePlugin({
      "process.env": {
        BROWSER: JSON.stringify(true),
        NODE_ENV: JSON.stringify("development"),
      }
    }),

    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),

    // stats
    function() { this.plugin("done", notifyStats); },
    function() { this.plugin("done", writeStats); },

  ]
};
