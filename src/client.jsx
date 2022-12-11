require('babel-polyfill')

import React from 'react'
import ReactPiwik from 'react-piwik'
import {BrowserRouter} from 'react-router-dom'
import {addLocaleData, IntlProvider} from 'react-intl'
import {createBrowserHistory} from 'history'
import {render} from 'react-dom'

import config from './config'
import routes from './routes'


// Adapted from: https://github.com/ReactTraining/react-router/issues/394#issuecomment-230116115
const hashLinkScroll = () => {
  const {hash} = window.location

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

const createHistory = () => {
  const history = createBrowserHistory({basename: config.pathname})

  if (!config.matomo) {
    return history
  }

  const piwik = new ReactPiwik({
    url: config.matomo.url,
    siteId: parseFloat(config.matomo.siteId),
  })

  return piwik.connectToHistory(history)
}

const App = ({initialState, history}) => (
  // The following "UTC" indicates that we are not taking timezones into account when formatting dates: "2018-01-01" will always be formatted as 01/01/2018.
  <IntlProvider
    locale={initialState.locale}
    key={initialState.locale}
    messages={initialState.messages[initialState.locale]}
    timeZone="UTC"
  >
    <BrowserRouter
      routes={routes}
      history={history}
      onUpdate={hashLinkScroll}
    />
  </IntlProvider>
)


export const renderApp = () => {
  const appMountNode = document.getElementById('app-mount-node')
  const initialState = window.__INITIAL_STATE__
  const history = createHistory()

  addLocaleData(require(`react-intl/locale-data/${initialState.locale}`))

  render(<App initialState={initialState} history={history}/>, appMountNode)
}

renderApp()
