// Express middleware to render the app server-side and expose its state
// to the client

import React from "react"
import {renderToString, renderToStaticMarkup} from "react-dom/server"
import {match, RouterContext} from "react-router"
import {IntlProvider} from "react-intl"

import routes from "../routes"
import HtmlDocument from "./html-document"


export default function handleRender(state) {
  return function (req, res, /*, next*/) {
    match({routes, location: req.url}, (error, redirectLocation, renderProps) => {
      if (error) {
        res.status(500).send(error.message)
      } else if (redirectLocation) {
        res.redirect(302, redirectLocation.pathname + redirectLocation.search)
      } else if (renderProps) {
        res.send(renderHtmlDocument(renderProps, state))
      } else {
        res.status(404).send("Not found")
      }
    })
  }
}


function loadWebpackAssets() {
  const webpackAssetsFilePath = "../../webpack-assets.json"
  let webpackAssets
  if (process.env.NODE_ENV === "production") {
    webpackAssets = require(webpackAssetsFilePath)
  } else if (process.env.NODE_ENV === "development") {
    webpackAssets = require(webpackAssetsFilePath)
    // Do not cache webpack stats: the script file would change since
    // hot module replacement is enabled in the development env
    delete require.cache[require.resolve(webpackAssetsFilePath)]
  }
  return webpackAssets
}


function renderHtmlDocument(renderProps, state) {
  const appHtml = renderToString(
    <IntlProvider locale='fr'>
      <RouterContext
        {...renderProps}
        createElement={(Component, props) => <Component {...props} {...state} />}
      />
    </IntlProvider>
  )
  const webpackAssets = loadWebpackAssets()
  // Add external CSS copied to the public directory by CopyWebpackPlugin in webpack config.
  const bootstrapCss = process.env.NODE_ENV === "production"
    ? "/bootstrap/css/bootstrap.min.css"
    : "/bootstrap/css/bootstrap.css"
  let externalCss = [bootstrapCss, '/swagger-ui.css', '/style.css']
  if (process.env.NODE_ENV === "development") {
    externalCss = externalCss.map(
      value => "http://localhost:2031" + value // FIXME: the port should not be hard-coded.
    )
  }
  const css = webpackAssets.main.css.concat(externalCss)
  const html = renderToStaticMarkup(
    <HtmlDocument
      appHtml={appHtml}
      appInitialState={state}
      cssUrls={css}
      jsUrls={webpackAssets.main.js}
    />
  )
  const doctype = "<!DOCTYPE html>"
  return doctype + html
}
