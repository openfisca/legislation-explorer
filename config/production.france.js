// App config in a production environment.

const apiBaseUrl = process.env.API_URL || 'https://fr.openfisca.org/api/v21',
  gitHubProject = 'openfisca/openfisca-france',
  gitWebpageUrl = 'https://github.com/openfisca/legislation-explorer',
  matomo = {
    url: 'https://stats.data.gouv.fr',
    siteId: 4,
    trackErrors: true
  },
  useCommitReferenceFromApi = true,
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
  gitHubProject,
  gitWebpageUrl,
  matomo,
  ui,
  useCommitReferenceFromApi,
  websiteUrl,
}
