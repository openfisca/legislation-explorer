import config from '../config'

import { loadTranslations } from './lang'
import handleRender from './render'
import { addNormalizedDescription } from '../utils/search'
import { fetchEntities, fetchParameters, fetchVariables, fetchSwagger } from '../webservices'

import express from 'express'
import { assoc, map } from 'ramda'
import favicon from 'serve-favicon'

import path from 'path'


function startServer(state) {
  const server = express()
  server.use(favicon(path.resolve(__dirname, '../assets/favicon.ico')))
  server.use(express.static(path.resolve(__dirname, '../../public')))

  server.use(handleRender(config.pathname, state))

  // Generic server errors (e.g. not caught by components)
  server.use((err, req, res, next) => {
    console.error(req.method + ' ' + req.url, {error: err})
    if (server.get('env') === 'production') {
      res.status(500).send(
        '<h1>Error: ' + err.message + '</h1>'
        + '<p>This error has been logged at ' + new Date().toISOString() + '.</p>'
        + '<p>If this happens often, please <a href="https://github.com/openfisca/legislation-explorer/issues/new?title=' + err.message + '">open an issue</a>.</p>'
        + '<h2>Technical details</h2>'
        + '<pre>' + err.stack + '</pre>'
      )
    } else {
      next(err)
    }
  })

  server.listen(config.port, config.host, () => console.log(`Server listening on http://${config.host}:${config.port}/`))
}

console.log('Fetching initial data from Web API...')
Promise.all([fetchEntities(), fetchParameters(), fetchVariables(), fetchSwagger()])
  .then(([entitiesResponse, parametersResponse, variablesResponse, swaggerResponse]) => {
    console.log('Starting server...')

    const normalizedEntities = map(
      assoc('itemType', 'entity'),
      addNormalizedDescription(entitiesResponse.data)
    )
    const normalizedParameters = map(
      assoc('itemType', 'parameter'),
      addNormalizedDescription(parametersResponse.data)
    )
    const normalizedVariables = map(
      assoc('itemType', 'variable'),
      addNormalizedDescription(variablesResponse.data)
    )

    const messages = loadTranslations(path.join(__dirname, '../assets/lang/'))

    const state = {
      countryPackageName: variablesResponse['country-package'],
      countryPackageVersion: variablesResponse['country-package-version'],
      entities: normalizedEntities,
      parameters: normalizedParameters,
      variables: normalizedVariables,
      swaggerSpec: swaggerResponse.data,
      messages: messages,
    }
    startServer(state)
  })
  .catch((error) => {
    process.exitCode = 1
    throw error
  })
