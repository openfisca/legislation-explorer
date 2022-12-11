require('babel-polyfill')

import React from 'react'
import {BrowserRouter} from 'react-router-dom'
import {addLocaleData, IntlProvider} from 'react-intl'
import {render} from 'react-dom'

import client from './utils/client'
import config from './config'
import routes from './routes'


const App = ({initialState, history}) => (
  // The following "UTC" indicates that we are not taking timezones into account when formatting dates: "2018-01-01" will always be formatted as 01/01/2018.
  <IntlProvider
    key={initialState.locale}
    locale={initialState.locale}
    messages={initialState.messages[initialState.locale]}
    timeZone="UTC"
  >
    <BrowserRouter
      routes={routes}
      history={history}
      onUpdate={client.hashLinkScroll}
    />
  </IntlProvider>
)


export const renderApp = () => {
  const appMountNode = document.getElementById('app-mount-node')
  const initialState = window.__INITIAL_STATE__
  const history = client.createHistory(config.matomo)

  addLocaleData(require(`react-intl/locale-data/${initialState.locale}`))

  render(<App initialState={initialState} history={history}/>, appMountNode)
}

renderApp()
