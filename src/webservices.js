import fetch from 'isomorphic-fetch'

import config from './config'


async function fetchJson(url, options) {
  const response = await fetch(url, options)
    .catch(() => { throw new Error(`Could not fetch '${url}'.`)})
  if (response.status < 200 || response.status >= 300) {
    throw new Error(`'${url}' returned the unexpected return code: '${response.status}'.`)
  }
  const data = await response.json()
  return {
    data,
    'country-package': response.headers.get('country-package'),
    'country-package-version': response.headers.get('country-package-version'),
  }
}


export function fetchParameters(apiBaseUrl = config.apiBaseUrl) {
  return fetchJson(`${apiBaseUrl}/parameters`)
}

export function fetchVariables(apiBaseUrl = config.apiBaseUrl) {
  return fetchJson(`${apiBaseUrl}/variables`)
}

export function fetchParameter(parameterId, apiBaseUrl = config.apiBaseUrl) {
  return fetchJson(`${apiBaseUrl}/parameter/${parameterId}`)
}

export function fetchVariable(variableId, apiBaseUrl = config.apiBaseUrl) {
  return fetchJson(`${apiBaseUrl}/variable/${variableId}`)
}

export function fetchSwagger(apiBaseUrl = config.apiBaseUrl) {
  return fetchJson(`${apiBaseUrl}/spec`)
}
