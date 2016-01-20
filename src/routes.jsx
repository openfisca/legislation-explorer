import React from "react"
// React is used or JSX routes transformed into React.createElement().
import {DefaultRoute, NotFoundRoute, Route} from "react-router"

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
      .filter(route => route.handler.fetchData)
      .map(
        route => route.handler.fetchData(params, query)
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


var routes = (
  <Route handler={App}>
    <Route path="parameters">
      <Route handler={ParameterHandler} name="parameter" path=":name" />
      <DefaultRoute handler={ParametersHandler} name="parameters" />
    </Route>
    <Route path="variables">
      <Route handler={VariableHandler} name="variable" path=":name" />
      <DefaultRoute handler={VariablesHandler} name="variables" />
    </Route>
    <Route handler={AboutPage} name="about" />
    <DefaultRoute handler={HomePage} name="home" />
    <NotFoundRoute handler={NotFoundHandler} />
  </Route>
)


export default {fetchData, routes}
