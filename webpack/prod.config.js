// Webpack config for creating the production bundle.

// Register babel to have ES6 support on the server
require("babel/register");

var path = require("path");
var strip = require("strip-loader");
var webpack = require("webpack");

var assetsPath = path.join(__dirname, "../public/assets");
var writeStats = require("./utils/write-stats");


module.exports = {
  devtool: "source-map",
  entry: {
    "main": "./src/client.js"
  },
  output: {
    path: assetsPath,
    filename: "[name]-[chunkhash].js",
    chunkFilename: "[name]-[chunkhash].js",
    publicPath: "assets/"
  },
  module: {
    loaders: [
      {
        exclude: /node_modules/,
        loaders: [strip.loader("debug"), "babel"],
        test: /\.jsx?$/,
      },
    ],
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  progress: true,
  plugins: [

    // ignore debug statements
    new webpack.NormalModuleReplacementPlugin(/debug/, process.cwd() + "/webpack/utils/noop.js"),

    // set global vars
    new webpack.DefinePlugin({
      "process.env": {
        BROWSER: JSON.stringify(true),
        NODE_ENV: JSON.stringify("production"), // clean up some react stuff
      }
    }),

    // optimizations
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
          warnings: false
        }
    }),

    // stats
    function() { this.plugin("done", writeStats); },

  ]
};
