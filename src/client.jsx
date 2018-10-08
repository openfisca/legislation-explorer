import config from './config'
import routes from './routes'

import { createHashHistory } from 'history/createHashHistory'
import MatomoReactRouter from 'piwik-react-router'
import React from 'react'
import { render } from 'react-dom'
import { addLocaleData, IntlProvider } from 'react-intl'
import { Router, useRouterHistory } from 'react-router-dom'
require('babel-polyfill')


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
  const appMountNode = document.getElementById('app-mount-node')
  const initialState = window.__INITIAL_STATE__
  let history = useRouterHistory(createHashHistory)({basename: config.pathname})

  if (config.matomo)
    history = MatomoReactRouter(config.matomo).connectToHistory(history)

  addLocaleData(require(`react-intl/locale-data/${initialState.locale}`))

  render(
    <IntlProvider locale={initialState.locale} key={initialState.locale} messages={initialState.messages[initialState.locale]}>
      <Router
        createElement={(Component, props) => <Component {...props} {...initialState} />}
        history={history}
        onUpdate={hashLinkScroll}
        routes={routes}
      >
        <Route path="/" component={App} />
      </Router>
    </IntlProvider>,
    appMountNode
  )
}


renderApp()
