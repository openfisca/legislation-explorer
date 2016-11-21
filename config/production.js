// App config the for production environment.
// Do not require this directly. Use ./src/config instead.

const HOST = process.env.HOST || "api.openfisca.fr",
  apiBaseUrl = process.env.API_URL || `https://${HOST}`,
  gitHubProject = process.env.GITHUB_PROJECT || "openfisca/openfisca-france",
  gitWebpageUrl = process.env.GIT_WEBPAGE_URL || "https://github.com/openfisca/legislation-explorer",
  useCommitReferenceFromApi = process.env.USE_COMMIT_REFERENCE_FROM_API
    ? JSON.parse(process.env.USE_COMMIT_REFERENCE_FROM_API)
    : true,
  websiteUrl = process.env.WEBSITE_URL || "https://www.openfisca.fr/"


export default {
  apiBaseUrl,
  gitHubProject,
  gitWebpageUrl,
  useCommitReferenceFromApi,
  websiteUrl
}
