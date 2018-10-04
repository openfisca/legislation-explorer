import React from 'react'
import {Route, IndexRoute} from 'react-router'

import config from './config'
import App from './components/app'
import HomePage from './components/pages/home'
import SwaggerPage from './components/pages/swagger'
import CountryModelItemPage from './components/pages/country-model-item'


export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} />
    <Route path={config.pathname} component={HomePage}/>
    <Route path="swagger" component={SwaggerPage}/>
    <Route path=":name" component={CountryModelItemPage}/>
  </Route>
)
