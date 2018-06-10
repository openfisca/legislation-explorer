// App config in a production environment.

import winston from 'winston'


const apiBaseUrl = process.env.API_URL || 'https://fr.openfisca.org/api/v21',
  gitHubProject = 'openfisca/openfisca-france',
  gitWebpageUrl = 'https://github.com/openfisca/legislation-explorer',
  piwikConfig = {
    url: 'https://stats.data.gouv.fr',
    siteId: 4,
    trackErrors: true
  },
  useCommitReferenceFromApi = true,
  websiteUrl = 'https://fr.openfisca.org/',
  winstonConfig = {
    transports: [
      new (winston.transports.Console)({timestamp: true}),
    ]
  },
  ui = {
    en: {
      countryName: 'France',
      search_placeholder: 'smic, salaire net',
    },
    fr: {
      countryName: 'France',
      search_placeholder: 'smic, salaire net',
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
