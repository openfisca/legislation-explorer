// App config in a development environment.

const apiBaseUrl = 'http://0.0.0.0:5000',
  changelogUrl = 'https://github.com/openfisca/country-template/blob/master/CHANGELOG.md',
  matomo = null,
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
  matomo,
  ui,
}
