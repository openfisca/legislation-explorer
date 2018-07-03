// App config in a production environment.

const apiBaseUrl = 'https://api.openfisca.tn',
  gitHubProject = 'openfisca/openfisca-tunisia',
  gitWebpageUrl = 'https://github.com/openfisca/legislation-explorer',
  matomo = {
    url: 'https://stats.data.gouv.fr',
    siteId: 4,
    trackErrors: true
  },
  websiteUrl = 'https://openfisca.org',
  ui = {
    en: {
      countryName: 'Tunisia',
    },
    fr: {
      countryName: 'Tunisie',
    }
  }


export default {
  apiBaseUrl,
  gitHubProject,
  gitWebpageUrl,
  matomo,
  ui,
  websiteUrl
}
