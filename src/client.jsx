import hljs from "highlight.js/lib/highlight"
import React from "react"
import {render} from "react-dom"
import {Router, browserHistory} from "react-router"
import {IntlProvider, addLocaleData} from "react-intl"
import fr from "react-intl/locale-data/fr"

import routes from "./routes"


require("babel-polyfill")

addLocaleData(fr)

hljs.registerLanguage("python", require("highlight.js/lib/languages/python"))

export function renderApp() {
  const appMountNode = document.getElementById("app-mount-node")
  const initialState = window.__INITIAL_STATE__
  render(
    <IntlProvider locale="fr">
      <Router
        createElement={(Component, props) => <Component {...props} {...initialState} />}
        history={browserHistory}
        onUpdate={() => window.scrollTo(0, 0)}
        routes={routes}
      />
    </IntlProvider>,
    appMountNode
  )
}


renderApp()
