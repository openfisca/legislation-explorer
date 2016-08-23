// App config the for development environment.
// Do not require this directly. Use ./src/config instead.


import {gitWebpageUrl} from "./production"


const HOST = process.env.HOST || "localhost",
  apiBaseUrl = process.env.API_URL || `http://${HOST}:2000`,
  websiteUrl = `http://${HOST}:2010/`


export default {
  apiBaseUrl,
  gitWebpageUrl,
  websiteUrl
}
