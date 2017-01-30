// App config the for production environment.
// Do not require this directly. Use ./src/config instead.

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
  websiteUrl = "https://www.openfisca.fr/"


export default {
  apiBaseUrl,
  gitHubProject,
  gitWebpageUrl,
  piwikConfig,
  useCommitReferenceFromApi,
  websiteUrl
}
