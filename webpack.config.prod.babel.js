// Webpack config for creating the production bundle.

import CopyWebpackPlugin from 'copy-webpack-plugin'
import path from 'path'
import webpack from 'webpack'

import writeAssets from './src/server/write-assets'


const assetsPath = path.join(__dirname, 'public')
const pathname = process.env.PATHNAME || ''

module.exports = {
  // devtool: "eval", // Transformed code
  devtool: 'source-map', // Original code
  entry: {
    'main': './src/client.jsx',
  },
  output: {
    path: assetsPath,
    filename: '[name]-[hash].js',
    publicPath: `${pathname}/`,
  },
  target: 'web',
  // yaml-js has a reference to `fs`, this is a workaround
  node: {
    fs: 'empty'
  },
  module: {
    loaders: [
      {
        exclude: /(node_modules|public)/,
        loader: 'babel',
        test: /\.(js|jsx)$/,
      },
      {
        loader: 'json-loader',
        test: /\.json$/,
      }
    ],
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  progress: true,
  plugins: [

    // set global vars
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'), // clean up some react stuff
        PATHNAME: JSON.stringify(pathname),
      },
    }),

    new webpack.ProvidePlugin({
      React: 'react', // For babel JSX transformation which generates React.createElement.
    }),

    new CopyWebpackPlugin([
      // 'to' values are relative to the public directory configured by output.path
      {from: 'src/assets/style.css', to: '.'},
      {from: 'node_modules/bootstrap/dist', to: 'bootstrap'},
      {from: 'node_modules/highlight.js/styles/github-gist.css', to: '.'},
      {from: 'node_modules/swagger-ui/dist/swagger-ui.css', to: '.'},
    ]),

    // optimizations
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),

    function() { this.plugin('done', writeAssets(path.resolve(__dirname, 'webpack-assets.json'))) },
  ],
}
