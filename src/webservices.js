import fetch from "isomorphic-fetch"

import config from "./config"


function fetchJson(url, options) {
  return fetch(url, options).then(parseJsonResponse)
}


function parseJsonResponse(response) {
  return response.json().then(data => {
    if (response.status >= 200 && response.status < 300) {
      return data
    } else {
      throw new Error(JSON.stringify(data.error))
    }
  })
}


export function fetchParameters(apiBaseUrl = config.parameterApiBaseUrl) {
  return fetchJson(`${apiBaseUrl}/parameters`)
}


export function fetchVariables(apiBaseUrl = config.apiBaseUrl) {
  return fetchJson(`${apiBaseUrl}/api/1/variables`)
}


export function fetchParameter(parameterId, apiBaseUrl = config.parameterApiBaseUrl) {
  return fetchJson(`${apiBaseUrl}/parameter/${parameterId}`)
}
