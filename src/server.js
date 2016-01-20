import compression from "compression"
import emailjs from "emailjs"
import express from "express"
import favicon from "serve-favicon"
import morgan from "morgan"
import path from "path"

import render from "./server/render"


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


const server = express()

server.use(morgan(server.get("env") === "production" ? "combined" : "dev"))
server.use(compression())
server.use(favicon(path.resolve(__dirname, "./assets/favicon.ico")))

// Use the public directory for static files.
// This directory is created by webpack on build time (npm run build).
// On development it serves assets like bootstrap CSS, on production it serves the bundled JS too.
server.use(express.static(path.resolve(__dirname, "../public")))

// On development, serve the static files from the webpack dev server.
if (server.get("env") === "development") {
  require("../webpack/server")
}

// Render the app server-side and send it as response
server.use(render)

// Generic server errors (e.g. not caught by components)
server.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.log("Error on request %s %s", req.method, req.url)
  if (server.get("env") === "production") {
    console.log("err", err)
    console.log("err.stack", err.stack)
    sendErrorEmail(req, err)
    res.status(500).send("Something bad happened (server error). An email has been sent to the team.")
  } else {
    next(err)
  }
})

server.set("port", process.env.PORT || 2030)

server.listen(server.get("port"), () => {
  console.log(`Express ${server.get("env")} server listening on ${server.get("port")}`)
})
