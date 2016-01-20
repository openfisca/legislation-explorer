import config from "./config"


const debug = require("debug")("app:webservices")


// Fetch polyfill

function loadFetch() {
  if (process.env.BROWSER) {
    if (window.fetch) {
      return window.fetch
    } else {
      require("whatwg-fetch")
      return window.fetch
    }
  } else {
    return require("node-fetch")
  }
}
var fetch = loadFetch()


// Generic fetch functions

var dataByUrl = new Map()


function fetchCachedJson(url, options) {
  if (dataByUrl.has(url)) {
    debug("Found data in cache for URL", url)
    return Promise.resolve(dataByUrl.get(url))
  } else {
    return fetchJson(url, options)
      .then(data => {
        dataByUrl.set(url, data)
        return data
      })
  }
}


function fetchJson(url, options) {
  return loggedFetch(url, options).then(parseJsonResponse)
}


function loggedFetch(url, ...args) {
  debug("About to fetch URL", url)
  return fetch(url, ...args)
}


async function parseJsonResponse(response) {
  const data = await response.json()
  if (response.status >= 200 && response.status < 300) {
    return data
  } else {
    throw new Error(JSON.stringify(data.error))
  }
}


// API fetch functions

function fetchParameters(apiBaseUrl = config.apiBaseUrl) {
  return fetchCachedJson(`${apiBaseUrl}/api/1/parameters`)
}


function fetchVariables(apiBaseUrl = config.apiBaseUrl) {
  return fetchCachedJson(`${apiBaseUrl}/api/1/variables`)
}


export default {fetchParameters, fetchVariables}
