// This is the webpack config to use during development.
// It enables the hot module replacement, the source maps and inline CSS styles.

import path from 'path'

import CopyWebpackPlugin from 'copy-webpack-plugin'
import ErrorNotificationPlugin from 'webpack-error-notification'
import webpack from 'webpack'

import config from './src/config'
import writeAssets from './src/server/write-assets'


const assetsPath = path.resolve(__dirname, 'public')

const port = config.port + 1


module.exports = {
  mode: 'development',
  // devtool: "eval", // Transformed code
  devtool: 'source-map', // Original code
  entry: {
    'main': [
      `webpack-dev-server/client?http://${config.host}:${port}`,
      'webpack/hot/only-dev-server',
      './src/client.jsx',
    ],
  },
  output: {
    path: assetsPath,
    filename: '[name]-bundle-[hash].js',
    publicPath: `http://${config.host}:${port}/`,
  },
  target: 'web',

  // yaml-js has a reference to `fs`, this is a workaround
  node: {
    fs: 'empty'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|public)/,
        use: [{
          loader: '@babel/loader',
          options: {
            plugins: [
              ['react-transform', {
                'transforms': [{
                  'transform': 'react-transform-hmr',
                  'imports': ['react'],
                  'locals': ['module'],
                }]
              }]
            ]
          }
        }]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    // hot reload
    new webpack.HotModuleReplacementPlugin(),

    // print a webpack progress
    new webpack.ProgressPlugin((percentage) => {
      if (percentage === 1) {
        process.stdout.write('Bundle is ready')
      }
    }),

    new ErrorNotificationPlugin(process.platform === 'linux' && function (msg) {
      if (!this.lastBuildSucceeded) {
        require('child_process').exec('notify-send --hint=int:transient:1 Webpack ' + msg)
      }
    }),

    new webpack.DefinePlugin({
      'process.env': {
        API_URL: JSON.stringify(config.apiBaseUrl),
        CHANGELOG_URL: JSON.stringify(config.changelogUrl),
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        PATHNAME: JSON.stringify(config.pathname),
      }
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

    function () {
      this.plugin('done', writeAssets(path.resolve(__dirname, 'webpack-assets.json')).bind(this))
    },
  ],
}
