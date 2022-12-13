import MatomoReactRouter from 'piwik-react-router'
import React from 'react'
import { Router, useRouterHistory } from 'react-router'
import { addLocaleData, IntlProvider } from 'react-intl'
import { createHistory } from 'history'
import { render } from 'react-dom'

import config from './config'
import routes from './routes'

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

const renderApp = () => {
  const appMountNode = document.getElementById('app-mount-node')
  const initialState = window.__INITIAL_STATE__
  let history = useRouterHistory(createHistory)({basename: config.pathname})

  if (config.matomo)
    history = MatomoReactRouter(config.matomo).connectToHistory(history)

  addLocaleData(require(`react-intl/locale-data/${initialState.locale}`))

  return render(
    // The following "UTC" indicates that we are not taking timezones into account when formatting dates: "2018-01-01" will always be formatted as 01/01/2018.
    <IntlProvider locale={initialState.locale} key={initialState.locale} messages={initialState.messages[initialState.locale]} timeZone="UTC">
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

export {renderApp}

renderApp()
