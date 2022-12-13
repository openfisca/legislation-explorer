import url from 'url'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'

import webpackDevConfig from '../../webpack.config.dev'

const publicURL = url.parse(webpackDevConfig.output.publicPath)

const options = {
  host: publicURL.hostname,
  port: publicURL.port,
  headers: {'Access-Control-Allow-Origin': '*'},
  historyApiFallback: true,
  static: {publicPath: webpackDevConfig.output.publicPath}
}

const compiler = webpack({
  ...webpackDevConfig,
  stats: 'errors-only',
})

new WebpackDevServer(options, compiler).start().then(() => {
  console.log(`Webpack development server listening on ${publicURL}`)
}).catch((err) => {
  console.error(err)
})
