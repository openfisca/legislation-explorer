import path from 'path'

import CopyWebpackPlugin from 'copy-webpack-plugin'
import webpack from 'webpack'

import WriteAssetsPlugin from './src/server/write-assets'
import config from './src/config'
import {loadTranslations} from './src/server/lang'

const assetsPath = path.join(__dirname, 'public')
const webpackAssetsPath = path.resolve(__dirname, 'webpack-assets.json')

const supportedLanguages = Object.keys(loadTranslations(path.join(__dirname, './src/assets/lang/')))

module.exports = {
  // devtool: "eval", // Transformed code
  devtool: 'source-map', // Original code
  entry: {
    'main': ['./src/client.jsx'],
  },
  output: {
    path: assetsPath,
    filename: '[name]-[contenthash].js',
    publicPath: config.pathname.endsWith('/') ? config.pathname : `${config.pathname}/`
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|public)/,
        use: [{
          loader: 'babel-loader'
        }]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    fallback: {
      fs: false,
      stream: false,
    },
  },
  plugins: [
    // set global vars
    new webpack.DefinePlugin({
      'process.env': {
        API_URL: JSON.stringify(config.apiBaseUrl),
        PATHNAME: JSON.stringify(config.pathname),
        CHANGELOG_URL: JSON.stringify(config.changelogUrl),
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

    // Only load syntax highlighting for Python
    new webpack.ContextReplacementPlugin(
      /highlight\.js\/lib\/languages$/,
      new RegExp('^./(python)$')
    ),

    // Only load locale for supported languages
    new webpack.ContextReplacementPlugin(
      /react-intl\/locale-data$/,
      new RegExp(`^./(${supportedLanguages.join('|')})$`)
    ),

    new WriteAssetsPlugin(webpackAssetsPath),
  ],
}
