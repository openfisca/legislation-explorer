import PiwikReactRouter from "piwik-react-router"
import React from "react"
import {render} from "react-dom"
import {Router, browserHistory} from "react-router"

import {addLocaleData, IntlProvider} from "react-intl"
import fr from "react-intl/locale-data/fr"
import en from "react-intl/locale-data/en"

import config from "./config"
import routes from "./routes"

require("babel-polyfill")


//Load languages:
const TRANSLATIONS = ['fr', 'en']
const DEFAULT_LANGUAGE = 'fr'

addLocaleData(...fr)
addLocaleData(...en)

function loadTranslations(){
  var messages = new Map()
  for (var t of TRANSLATIONS){
    messages.set(t, require('json!./assets/lang/' + t + '.json'))
  }
  return messages
}

const localeProp = navigator.language ? navigator.language : DEFAULT_LANGUAGE
const messagesProp = loadTranslations()


// Adapted from: https://github.com/ReactTraining/react-router/issues/394#issuecomment-230116115
function hashLinkScroll() {
  const { hash } = window.location
  if (hash === '') {
    window.scrollTo(0, 0)
  } else {
    window.requestAnimationFrame(() => {
      const id = hash.replace('#', '')
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView()
      }
    })
  }
}

export function renderApp() {
  const appMountNode = document.getElementById("app-mount-node")
  const initialState = window.__INITIAL_STATE__
  const history = config.piwikConfig
    ? PiwikReactRouter(config.piwikConfig).connectToHistory(browserHistory)
    : browserHistory
  render(
    <IntlProvider locale={localeProp} key={localeProp} messages={messagesProp.get(localeProp)}>
      <Router
        createElement={(Component, props) => <Component {...props} {...initialState} />}
        history={history}
        onUpdate={hashLinkScroll}
        routes={routes}
      />
    </IntlProvider>,
    appMountNode
  )
}


renderApp()
