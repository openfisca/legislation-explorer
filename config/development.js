// App config the for development environment.
// Do not require this directly. Use ./src/config instead.


import {gitWebpageUrl} from "./production"


const HOST = process.env.HOST || "localhost",
  apiBaseUrl = process.env.API_URL || `http://${HOST}:2000`,
  gitHubProject = process.env.GITHUB_PROJECT || "openfisca/openfisca-france",
  useCommitReferenceFromApi = process.env.USE_COMMIT_REFERENCE_FROM_API
    ? JSON.parse(process.env.USE_COMMIT_REFERENCE_FROM_API)
    : true,
  websiteUrl = `http://${HOST}:2010/`


export default {
  apiBaseUrl,
  gitHubProject,
  gitWebpageUrl,
  useCommitReferenceFromApi,
  websiteUrl
}
