import path from 'path'

import CopyWebpackPlugin from 'copy-webpack-plugin'
import webpack from 'webpack'

import config from './src/config'
import writeAssets from './src/server/write-assets'
import { loadTranslations } from './src/server/lang'


const assetsPath = path.join(__dirname, 'public')
const supportedLanguages = Object.keys(loadTranslations(path.join(__dirname, './src/assets/lang/')))

module.exports = {
  // devtool: "eval", // Transformed code
  devtool: 'source-map', // Original code
  entry: {
    'main': ['babel-polyfill', './src/client.jsx'],
  },
  output: {
    path: assetsPath,
    filename: '[name]-[hash].js',
    publicPath: config.pathname.endsWith('/') ? config.pathname : `${config.pathname}/`
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
          loader: 'babel-loader'
        }]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [

    // set global vars
    new webpack.DefinePlugin({
      'process.env': {
        API_URL: JSON.stringify(config.apiBaseUrl),
        CHANGELOG_URL: JSON.stringify(config.changelogUrl),
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        PATHNAME: JSON.stringify(config.pathname),
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

    function() { this.plugin('done', writeAssets(path.resolve(__dirname, 'webpack-assets.json')).bind(this)) },
  ],
}
