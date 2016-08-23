import React from "react"
import {Route, IndexRoute} from "react-router"

import App from "./components/app"
import HomePage from "./components/pages/home"
import NotFoundPage from "./components/pages/not-found"
import ParameterPage from "./components/pages/parameter"
import ParametersPage from "./components/pages/parameters"
import VariablePage from "./components/pages/variable"
import VariablesPage from "./components/pages/variables"


export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} />
    <Route path="parameters">
      <IndexRoute component={ParametersPage} />
      <Route path=":name" component={ParameterPage}/>
    </Route>
    <Route path="variables">
      <IndexRoute component={VariablesPage} />
      <Route path=":name" component={VariablePage} />
    </Route>
    <Route path="*" component={NotFoundPage} />
  </Route>
)
