// Express middleware to render the app server-side and expose its state
// to the client

import React from 'react'
import {renderToString, renderToStaticMarkup} from 'react-dom/server'
import {match, RouterContext} from 'react-router'
import {IntlProvider} from 'react-intl'

import {getLocale, getLocaleMessages} from './lang'
import routes from '../routes'
import HtmlDocument from './html-document'


export default function handleRender(state) {
  return function (req, res) {
    state.locale = getLocale(req.headers['accept-language'], state.messages)

    match({routes, location: req.url}, (error, redirectLocation, renderProps) => {
      if (error) {
        res.status(500).send(error.message)
      } else if (redirectLocation) {
        res.redirect(302, redirectLocation.pathname + redirectLocation.search)
      } else if (renderProps) {
        res.send(renderHtmlDocument(renderProps, state))
      } else {
        res.status(404).send('Not found')
      }
    })
  }
}

function loadWebpackAssets() {
  const WEBPACK_ASSETS_FILE_PATH = '../../webpack-assets.json'
  let webpackAssets = require(WEBPACK_ASSETS_FILE_PATH)

  if (process.env.NODE_ENV === 'development') {
    // Do not cache webpack stats: the script file would change since
    // hot module replacement is enabled in the development env
    delete require.cache[require.resolve(WEBPACK_ASSETS_FILE_PATH)]
  }

  return webpackAssets
}


function renderHtmlDocument(renderProps, state) {
  const appHtml = renderToString(
    <IntlProvider locale={state.locale} messages={getLocaleMessages(state.locale, state.messages)}>
      <RouterContext
        {...renderProps}
        createElement={(Component, props) => <Component {...props} {...state} />}
      />
    </IntlProvider>
  )
  const webpackAssets = loadWebpackAssets()
  const basename = process.env.BASENAME || ''

  // Add external CSS copied to the public directory by CopyWebpackPlugin in webpack config.
  const bootstrapCss = process.env.NODE_ENV === 'production'
    ? `${basename}/bootstrap/css/bootstrap.min.css`
    : `${basename}/bootstrap/css/bootstrap.css`

  let externalCss = [
    bootstrapCss,
    `${basename}/swagger-ui.css`,
    `${basename}/github-gist.css`,
    `${basename}/style.css`
  ]

  if (process.env.NODE_ENV === 'development') {
    externalCss = externalCss.map(
      value => 'http://localhost:2031' + value // FIXME: the port should not be hard-coded.
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
  const doctype = '<!DOCTYPE html>'
  return doctype + html
}
