import url from 'url'

import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'

import webpackDevConfig from '../../webpack.config.dev'


const publicURL = url.parse(webpackDevConfig.output.publicPath)

new WebpackDevServer(webpack(webpackDevConfig), {
  historyApiFallback: true,
  hot: true,
  noInfo: true,
  publicPath: webpackDevConfig.output.publicPath,
  stats: { colors: true },
  quiet: true,
}).listen(publicURL.port, publicURL.hostname, function (err) {
  if (err)
    return console.error(err)

  console.log(`Webpack development server listening on ${webpackDevConfig.output.publicPath}`)
})
