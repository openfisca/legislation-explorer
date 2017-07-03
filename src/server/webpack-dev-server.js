import webpack from "webpack"
import WebpackDevServer from "webpack-dev-server"

import config from "../../webpack.config.dev"


const WEBPACK_HOST = process.env.WEBPACK_HOST || "localhost"
const WEBPACK_PORT = parseInt(process.env.WEBPACK_PORT)


new WebpackDevServer(webpack(config), {
  historyApiFallback: true,
  hot: true,
  noInfo: true,
  publicPath: config.output.publicPath,
  stats: { colors: true },
  quiet: true,
}).listen(WEBPACK_PORT, WEBPACK_HOST, function (err) {
  if (err) { console.log(err) }
  console.log(`Webpack development server listening on http://${WEBPACK_HOST}:${WEBPACK_PORT}`)
})
