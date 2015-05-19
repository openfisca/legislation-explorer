// App config the for development environment.
// Do not require this directly. Use ./src/config instead.


import prodConfig from "./prod";


export default {
  apiBaseUrl: "http://localhost:2000/api/1",
  githubBranchName: prodConfig.githubBranchName,
  gitWebpageUrl: prodConfig.gitWebpageUrl,
  websiteUrl: "http://localhost:2010/",
};
