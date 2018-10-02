import React from 'react'
import {Redirect, Route, IndexRedirect, IndexRoute} from 'react-router'

import App from './components/app'
import HomePage from './components/pages/home'
import SwaggerPage from './components/pages/swagger'
import CountryModelItemPage from './components/pages/country-model-item'


export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} />
    <Route path="swagger" component={SwaggerPage}/>
    <Route path=":name" component={CountryModelItemPage}/>
    <Route path="parameters">
      <IndexRedirect to="/" />
      <Redirect from=":name" to="/:name" />
    </Route>
    <Route path="variables">
      <IndexRedirect to="/" />
      <Redirect from=":name" to="/:name" />
    </Route>
    <Route path="entities">
      <IndexRedirect to="/" />
      <Redirect from=":name" to="/:name" />
    </Route>
  </Route>
)
