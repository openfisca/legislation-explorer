// Starts a webpack dev server for dev environments

import config from "./dev.config";
import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";


const debug = require("debug")("app:server");

const WEBPACK_HOST = process.env.HOST || "localhost";
const WEBPACK_PORT = parseInt(process.env.PORT) + 1 || 2031;

const serverOptions = {
  contentBase: `http://${WEBPACK_HOST}:${WEBPACK_PORT}`,
  hot: true,
  noInfo: true,
  publicPath: config.output.publicPath,
  quiet: true,
};

const compiler = webpack(config);
const webpackDevServer = new WebpackDevServer(compiler, serverOptions);

webpackDevServer.listen(WEBPACK_PORT, WEBPACK_HOST, () => {
  debug("Webpack development server listening on %s:%s", WEBPACK_HOST, WEBPACK_PORT);
});
