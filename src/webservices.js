import fetch from 'isomorphic-fetch'

import config from './config'


function fetchJson(url, options) {
  return fetch(url, options)
    .then(response => response.json()
      .then(data => {
        if (response.status >= 200 && response.status < 300) {
          return {
            data,
            'country-package': response.headers.get('country-package'),
            'country-package-version': response.headers.get('country-package-version'),
          }
        }
        if (data.error) {
          throw new Error(JSON.stringify(data.error))
        }
        throw new Error(JSON.stringify({error: 'Unexpected return code ' + response.status}))
      })
  )
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
