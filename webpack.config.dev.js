// This is the webpack config to use during development.
// It enables the hot module replacement, the source maps and inline CSS styles.

import path from 'path'

import CopyWebpackPlugin from 'copy-webpack-plugin'
import webpack from 'webpack'

import WriteAssetsPlugin from './src/server/write-assets'
import config from './src/config'

const assetsPath = path.resolve(__dirname, 'public')
const webpackAssetsPath = path.resolve(__dirname, 'webpack-assets.json')

const port = config.port + 1

module.exports = {
  mode: 'development',
  // devtool: "eval", // Transformed code
  devtool: 'source-map', // Original code
  entry: {
    'main': [
      `webpack-dev-server/client?http://${config.host}:${port}`,
      './src/client.jsx',
    ],
  },
  output: {
    path: assetsPath,
    filename: '[name]-bundle-[contenthash].js',
    publicPath: `http://${config.host}:${port}/`,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|public)/,
        use: [{
          loader: 'babel-loader',
          options: {
            plugins: [],
          },
        }],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    fallback: {
      fs: false,
      stream: false,
    },
  },
  plugins: [
    // print a webpack progress
    new webpack.ProgressPlugin((percentage) => {
      if (percentage === 1) {
        process.stdout.write('Bundle is ready')
      }
    }),

    new webpack.DefinePlugin({
      'process.env': {
        API_URL: JSON.stringify(config.apiBaseUrl),
        PATHNAME: JSON.stringify(config.pathname),
        CHANGELOG_URL: JSON.stringify(config.changelogUrl),
      }
    }),

    new webpack.ProvidePlugin({
      React: 'react', // For babel JSX transformation which generates React.createElement.
    }),

    new CopyWebpackPlugin({
      patterns: [
        {from: 'src/assets/style.css', to: '.'},
        {from: 'node_modules/bootstrap/dist', to: 'bootstrap'},
        {from: 'node_modules/highlight.js/styles/github-gist.css', to: '.'},
        {from: 'node_modules/swagger-ui/dist/swagger-ui.css', to: '.'},
      ],
    }),

    new WriteAssetsPlugin(webpackAssetsPath),
  ],
}

