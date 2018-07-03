// App config in a production environment.

const apiBaseUrl = 'https://fr.openfisca.org/api/v21',
  changelogUrl = 'https://github.com/openfisca/openfisca-france/blob/master/CHANGELOG.md',
  matomo = {
    url: 'https://stats.data.gouv.fr',
    siteId: 4,
    trackErrors: true
  },
  websiteUrl = 'https://fr.openfisca.org/',
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
  changelogUrl,
  matomo,
  ui,
  websiteUrl,
}
