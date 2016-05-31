import {EventEmitter} from "events"
import React from "react"
import { render } from "react-dom"
import {Router, match, browserHistory} from "react-router"
import {IntlProvider, addLocaleData} from "react-intl"
import fr from "react-intl/locale-data/fr"

addLocaleData(fr)
// Polyfills, loaded at the very first.

require("babel-polyfill")

import hljs from "highlight.js/lib/highlight"
hljs.registerLanguage("python", require("highlight.js/lib/languages/python"))

if (!global.Intl) {
    require.ensure([
        "intl",
        "intl/locale-data/jsonp/fr.js",
    ], function (require) {
        require("intl")
        require("intl/locale-data/jsonp/fr.js")
        renderApp()
    })
} else {
    renderApp()
}


const error = require("debug")("app:client")
error.log = console.error.bind(console)


function renderApp() {
  // Load routes after Intl polyfill since App component imports Intl mixin.
  //TODO bring back Intl
  var {fetchData, routes} = require("./routes")

  global.loadingEvents = new EventEmitter()
  const appMountNode = document.getElementById("app-mount-node")


  //TODO What's that if ?
  if (window.isPageRenderedOnServer) {
    window.isPageRenderedOnServer = false
  } else {
    render(
      <IntlProvider locale="fr">
        <Router history={browserHistory} routes={routes}/>
      </IntlProvider>, appMountNode
    )
  }
  global.loadingEvents.emit("loadStart")
  match({ history: browserHistory, routes }, (routeError, redirectLocation, renderProps) => {
    const {routes: matchedRoutes, params, query} = renderProps
    fetchData(matchedRoutes, params, query)
      .then(
        dataByRouteName => {
          render(
//TODO is this enough ? See this if not : https://github.com/yahoo/react-intl/tree/master/examples/translations
            <IntlProvider locale="fr">
              <Router {...renderProps} dataByRouteName={dataByRouteName} />
            </IntlProvider>, appMountNode
          )
        },
        errorByRouteName => {
          render(
            <IntlProvider locale="fr">
              <Router {...renderProps} errorByRouteName={errorByRouteName} />
            </IntlProvider>, appMountNode
          )
          error("errorByRouteName", errorByRouteName)
        }
      )
      .then(
        () => global.loadingEvents.emit("loadEnd")
      )
  })
}
