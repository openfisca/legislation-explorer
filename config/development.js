// App config in a development environment.

import winston from "winston"


const HOST = process.env.HOST || "localhost",
  apiBaseUrl = process.env.API_URL || `http://${HOST}:5000`,
  gitHubProject = "openfisca/openfisca-france",
  gitWebpageUrl = "https://github.com/openfisca/legislation-explorer",
  piwikConfig = null,
  useCommitReferenceFromApi = true,
  websiteUrl = "http://openfisca.org",
  winstonConfig = {
    transports: [
      new (winston.transports.Console)({timestamp: true}),
    ]
  },
  ui = {
    en: {
      countryName: 'the development environment',
    },
    fr: {
      countryName: 'l’environnement de développement',
    }
  }


export default {
  apiBaseUrl,
  gitHubProject,
  gitWebpageUrl,
  piwikConfig,
  ui,
  useCommitReferenceFromApi,
  websiteUrl,
  winstonConfig,
}
