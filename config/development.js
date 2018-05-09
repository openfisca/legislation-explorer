// App config the for development environment.
// Do not require this directly. Use ./src/config instead.

import winston from "winston"


const HOST = process.env.HOST || "localhost",
  apiBaseUrl = process.env.API_URL || `http://${HOST}:5000`,
  gitHubProject = "openfisca/openfisca-france",
  gitWebpageUrl = "https://github.com/openfisca/legislation-explorer",
  piwikConfig = null,
  useCommitReferenceFromApi = true,
  websiteUrl = "http://openfisca.org/",
  winstonConfig = {
    transports: [
      new (winston.transports.Console)({timestamp: true}),
    ]
  }


export default {
  apiBaseUrl,
  gitHubProject,
  gitWebpageUrl,
  piwikConfig,
  useCommitReferenceFromApi,
  websiteUrl,
  winstonConfig,
}
