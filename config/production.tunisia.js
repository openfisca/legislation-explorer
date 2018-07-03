// App config in a production environment.

const apiBaseUrl = 'https://api.openfisca.tn',
  changelogUrl = 'https://github.com/openfisca/openfisca-tunisia/blob/master/CHANGELOG.md',
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
  changelogUrl,
  gitWebpageUrl,
  matomo,
  ui,
  websiteUrl
}
