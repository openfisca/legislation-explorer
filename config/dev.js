// App config the for development environment.
// Do not require this directly. Use ./src/config instead.


import {gitWebpageUrl} from "./prod"


const WEBPACK_HOST = process.env.HOST || "localhost",
  apiBaseUrl = `http://${WEBPACK_HOST}:2000`,
  websiteUrl = `http://${WEBPACK_HOST}:2010/`

export {
  apiBaseUrl,
  gitWebpageUrl,
  websiteUrl
}
