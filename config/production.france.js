// App config the for production environment.
// Do not require this directly. Use ./src/config instead.

const HOST = process.env.HOST || "api.openfisca.fr",
  apiBaseUrl = process.env.API_URL || `https://${HOST}`,
  parameterApiBaseUrl = process.env.FLASK_API_URL || `https://api-test.openfisca.fr`,
  gitHubProject = "openfisca/openfisca-france",
  gitWebpageUrl = "https://github.com/openfisca/legislation-explorer",
  piwikConfig = {
    url: "https://stats.data.gouv.fr",
    siteId: 4,
    trackErrors: true
  },
  useCommitReferenceFromApi = true,
  websiteUrl = "https://www.openfisca.fr/"


export default {
  apiBaseUrl,
  gitHubProject,
  gitWebpageUrl,
  parameterApiBaseUrl,
  piwikConfig,
  useCommitReferenceFromApi,
  websiteUrl,
}
