// App config in a production environment.

const HOST = process.env.HOST || "api.openfisca.tn",
  apiBaseUrl = process.env.API_URL || `https://${HOST}`,
  gitHubProject = "openfisca/openfisca-tunisia",
  gitWebpageUrl = "https://github.com/openfisca/legislation-explorer",
  piwikConfig = {
    url: "https://stats.data.gouv.fr",
    siteId: 4,
    trackErrors: true
  },
  useCommitReferenceFromApi = false,
  websiteUrl = "http://openfisca.org"


export default {
  apiBaseUrl,
  gitHubProject,
  gitWebpageUrl,
  piwikConfig,
  useCommitReferenceFromApi,
  websiteUrl
}
