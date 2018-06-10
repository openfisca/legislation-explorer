// App config in a development environment.

const HOST = process.env.HOST || 'localhost',
  apiBaseUrl = process.env.API_URL || `http://${HOST}:5000`,
  gitHubProject = 'openfisca/country-template',
  gitWebpageUrl = 'https://github.com/openfisca/legislation-explorer',
  matomo = null,
  useCommitReferenceFromApi = true,
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
  gitHubProject,
  gitWebpageUrl,
  matomo,
  ui,
  useCommitReferenceFromApi,
  websiteUrl,
}
