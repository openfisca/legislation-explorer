import React from 'react'
import {Switch, Route, IndexRoute} from 'react-router-dom'

import config from './config'
import App from './components/app'
import HomePage from './components/pages/home'
import SwaggerPage from './components/pages/swagger'
import CountryModelItemPage from './components/pages/country-model-item'


export default (
  <Switch>
    <Route exact path={config.pathname} component={HomePage}/>
    <Route exact path="swagger" component={SwaggerPage}/>
    <Route exact path=":name" component={CountryModelItemPage}/>
    <Route exact path="/" component={HomePage}/>
  </Switch>
)
