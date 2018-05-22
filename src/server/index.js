import express from "express"
import {assoc, map} from "ramda"
import favicon from "serve-favicon"
import path from "path"
import winston from "winston"

import handleRender from "./render"
import {addNormalizedDescription} from "../search"
import {fetchParameters, fetchVariables, fetchSwagger} from "../webservices"
import config from "../config"
import {loadTranslations} from "./lang"


winston.configure(config.winstonConfig);


function startServer(state) {
  const server = express()
  server.use(favicon(path.resolve(__dirname, "../assets/favicon.ico")))
  server.use(express.static(path.resolve(__dirname, "../../public")))

  server.use(handleRender(state))

  // Generic server errors (e.g. not caught by components)
  server.use((err, req, res, next) => {
    winston.error(req.method + " " + req.url, {error: err})
    if (server.get("env") === "production") {
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

  const host = process.env.HOST || "localhost"
  const port = process.env.PORT || 2030
  server.listen(port, host, () => {
    console.log(`Server listening at http://${host}:${port}/`)
  })
}

console.log("Fetching variables and parameters on Web API...")
Promise.all([fetchParameters(), fetchVariables(), fetchSwagger()])
  .then(([parametersResponse, variablesResponse, swaggerResponse]) => {
    console.log("Starting server...")
    const normalizedParameters = map(
      assoc('itemType', 'parameter'),
      addNormalizedDescription(parametersResponse.data)
    )
    const normalizedVariables = map(
      assoc('itemType', 'variable'),
      addNormalizedDescription(variablesResponse.data)
    )

    const messages = loadTranslations(path.join(__dirname, "../assets/lang/"))

    const state = {
      countryPackageName: variablesResponse['country-package'],
      countryPackageVersion: variablesResponse['country-package-version'],
      parameters: normalizedParameters,
      variables: normalizedVariables,
      swaggerSpec: swaggerResponse.data,
      messages: messages,
    }
    startServer(state)
  }, error => {
    console.log('error:', error)
  })
  .catch((error) => {
    console.log('Top-level error:', error)
  })
