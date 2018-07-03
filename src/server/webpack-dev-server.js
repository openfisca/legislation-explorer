import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'

import webpackDevConfig from '../../webpack.config.dev'


const WEBPACK_HOST = process.env.WEBPACK_HOST || '0.0.0.0'
const WEBPACK_PORT = parseInt(process.env.WEBPACK_PORT) || 2031


new WebpackDevServer(webpack(webpackDevConfig), {
  historyApiFallback: true,
  hot: true,
  noInfo: true,
  publicPath: webpackDevConfig.output.publicPath,
  stats: { colors: true },
  quiet: true,
}).listen(WEBPACK_PORT, WEBPACK_HOST, function (err) {
  if (err) { console.log(err) }
  console.log(`Webpack development server listening on http://${WEBPACK_HOST}:${WEBPACK_PORT}`)
})
