import {EventEmitter} from "events"
import moment from "moment"
import React from "react"
import Router from "react-router"


// Polyfills, loaded at the very first.

require("babel-polyfill")

import hljs from "highlight.js/lib/highlight"
hljs.registerLanguage("python", require("highlight.js/lib/languages/python"))

import {intlData, polyfillIntl} from "./intl"
polyfillIntl(renderApp)

moment.locale(intlData.locales.slice(0, 2))


const error = require("debug")("app:client")
error.log = console.error.bind(console)


function renderApp() {
  // Load routes after Intl polyfill since App component imports Intl mixin.
  var {fetchData, routes} = require("./routes")

  global.loadingEvents = new EventEmitter()
  const appMountNode = document.getElementById("app-mount-node")
  Router.run(routes, Router.HistoryLocation, (Root, state) => {
    if (window.isPageRenderedOnServer) {
      window.isPageRenderedOnServer = false
    } else {
      React.render(<Root {...intlData} />, appMountNode)
    }
    global.loadingEvents.emit("loadStart")
    fetchData(state.routes, state.params, state.query)
      .then(
        dataByRouteName => {
          React.render(<Root dataByRouteName={dataByRouteName} {...intlData} />, appMountNode)
        },
        errorByRouteName => {
          React.render(<Root errorByRouteName={errorByRouteName} {...intlData} />, appMountNode)
          error("errorByRouteName", errorByRouteName)
        }
      )
      .then(
        () => global.loadingEvents.emit("loadEnd")
      )
  })
}
