import React from "react"
// React is used or JSX routes transformed into React.createElement().
import {Route, IndexRoute } from "react-router"

import AboutPage from "./components/pages/about-page"
import App from "./components/app"
import HomePage from "./components/pages/home-page"
import NotFoundHandler from "./components/route-handlers/not-found-handler"
import ParameterHandler from "./components/route-handlers/parameter-handler"
import ParametersHandler from "./components/route-handlers/parameters-handler"
import VariableHandler from "./components/route-handlers/variable-handler"
import VariablesHandler from "./components/route-handlers/variables-handler"


// const debug = require("debug")("app:routes")


function fetchData(matchedRoutes, params, query) {
  var dataByRouteName = {}
  var errorByRouteName = {}
  return Promise.all(
    matchedRoutes
      .filter(route => route.component.fetchData)
      .map(
        route => route.component.fetchData(params, query)
          .then(handlerData => { dataByRouteName[route.name] = handlerData })
          .catch(handlerError => { errorByRouteName[route.name] = handlerError })
      )
  ).then(() => {
    if (Object.keys(errorByRouteName).length > 0) {
      throw errorByRouteName
    }
    return dataByRouteName
  })
}

//<Router history={browserHistory}>
/* eslint-disable react/jsx-sort-props */
var routes = (
    <Route path="/" component={App}>
      <IndexRoute component={HomePage} />
      <Route path="parameters" >
        <Route path="parameters/:name" component={ParameterHandler}/>
        <IndexRoute component={ParametersHandler} />
      </Route>
      <Route path="variables">
        <Route path="/variables/:name" component={VariableHandler} />
        <IndexRoute component={VariablesHandler} />
      </Route>
      <Route path="about" component={AboutPage} />
      <Route path="*" component={NotFoundHandler} />
    </Route>
)
/* eslint-disable react/jsx-sort-props */


export {fetchData, routes}
