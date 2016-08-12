// App config the for development environment.
// Do not require this directly. Use ./src/config instead.


import prodConfig from "./prod"


const WEBPACK_HOST = process.env.HOST || "localhost"


export default {
  apiBaseUrl: `https://api.openfisca.fr`,
  gitWebpageUrl: prodConfig.gitWebpageUrl,
  websiteUrl: `http://${WEBPACK_HOST}:2010/`,
}
