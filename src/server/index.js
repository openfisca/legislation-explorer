import express from "express"
import {assoc, map} from "ramda"
import favicon from "serve-favicon"
import path from "path"
import winston from "winston"

import handleRender from "./render"
import {addNormalizedDescription} from "../search"
import {fetchParameters, fetchVariables, fetchSwagger} from "../webservices"


function startServer(state) {
  const server = express()
  server.use(favicon(path.resolve(__dirname, "../assets/favicon.ico")))
  server.use(express.static(path.resolve(__dirname, "../../public")))

  server.use(handleRender(state))

  // Generic server errors (e.g. not caught by components)
  server.use((err, req, res, next) => {
    winston.error("Error on request " + req.method + " " + req.url + '\n'  + err.stack)
    if (server.get("env") === "production") {
      res.status(500).send("Something unexpected happened, sorry. The error has been logged.")
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
      addNormalizedDescription(variablesResponse.data),
    )
    const state = {
      countryPackageName: variablesResponse['country-package'],
      countryPackageVersion: variablesResponse['country-package-version'],
      parameters: normalizedParameters,
      variables: normalizedVariables,
      swaggerSpec: swaggerResponse.data,
    }
    startServer(state)
  }, error => {
    console.log('error:', error)
  })
  .catch((error) => {
    console.log('Top-level error:', error)
  })
