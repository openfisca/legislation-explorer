// App config in a development environment.

const apiBaseUrl = 'http://0.0.0.0:5000',
  changelogUrl = 'https://github.com/openfisca/country-template/blob/master/CHANGELOG.md',
  gitWebpageUrl = 'https://github.com/openfisca/legislation-explorer',
  matomo = null,
  websiteUrl = 'https://openfisca.org',
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
  changelogUrl,
  gitWebpageUrl,
  matomo,
  ui,
  websiteUrl,
}
