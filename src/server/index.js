import emailjs from "emailjs"
import express from "express"
import favicon from "serve-favicon"
import path from "path"

import handleRender from "./render"
import {addNormalizedDescription} from "../search"
import {fetchParameters, fetchVariables} from "../webservices"


function sendErrorEmail(req, err) {
  const server = emailjs.server.connect({
    host: "localhost",
  })
  const fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl
  server.send(
    {
      from: "webmaster+legislation-explorer@openfisca.fr",
      subject: `Legislation Explorer Error: ${err.toString()}`,
      text: `
URL: ${fullUrl}

${err.stack}

${JSON.stringify(req.headers, null, 2)}`,
      to: "webmaster@openfisca.fr",
    },
    function(sendErr/*, message*/) {
      if (sendErr) {
        console.log("Error sending email:", sendErr)
      } else {
        console.log("Email sent")
      }
    }
  )
}


function startServer(state) {
  const server = express()
  server.use(favicon(path.resolve(__dirname, "../assets/favicon.ico")))
  server.use(express.static(path.resolve(__dirname, "../../public")))

  server.use(handleRender(state))

  // Generic server errors (e.g. not caught by components)
  server.use((err, req, res, next) => {
    console.log("Error on request %s %s", req.method, req.url)
    if (server.get("env") === "production") {
      console.log("err", err)
      console.log("err.stack", err.stack)
      sendErrorEmail(req, err)
      res.status(500).send("Something unexpected happened, sorry. An email has been sent to the team.")
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
Promise.all([fetchParameters(), fetchVariables()])
  .then(([parametersData, variablesData]) => {
    console.log("Starting server...")
    const {country_package_name, country_package_version, currency, parameters} = parametersData
    const {variables} = variablesData
    const state = {
      countryPackageName: country_package_name,
      countryPackageVersion: country_package_version,
      currency,
      parameters: addNormalizedDescription('description', parameters),
      variables: addNormalizedDescription('label', variables),
    }
    startServer(state)
  }, error => {
    console.log('error:', error)
  })
  .catch((error) => {
    console.log('Top-level error:', error)
  })
