/*
OpenFisca -- A versatile microsimulation software
By: OpenFisca Team <contact@openfisca.fr>

Copyright (C) 2011, 2012, 2013, 2014, 2015 OpenFisca Team
https://github.com/openfisca

This file is part of OpenFisca.

OpenFisca is free software; you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

OpenFisca is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/


import React from "react";
// React is used or JSX routes transformed into React.createElement().
import {DefaultRoute, NotFoundRoute, Route} from "react-router";

import App from "./components/app";
import AboutPage from "./components/pages/about-page";
import HomePage from "./components/pages/home-page";
import NotFoundPage from "./components/pages/not-found-page";
import VariableHandler from "./components/route-handlers/variable-handler";
import VariablesHandler from "./components/route-handlers/variables-handler";


const debug = require("debug")("app:routes");


function fetchData(matchedRoutes, params, query) {
  var dataByRouteName = {};
  var errorByRouteName = {};
  return Promise.all(
    matchedRoutes
      .filter(route => route.handler.fetchData)
      .map(
        route => route.handler.fetchData(params, query)
          .then(handlerData => { dataByRouteName[route.name] = handlerData; })
          .catch(handlerError => { errorByRouteName[route.name] = handlerError; })
      )
  ).then(() => {
    if (Object.keys(errorByRouteName).length > 0) {
      throw errorByRouteName;
    }
    return dataByRouteName;
  });
}


var routes = (
  <Route handler={App}>
    <Route path="variables">
      <Route handler={VariableHandler} name="variable" path=":name" />
      <DefaultRoute handler={VariablesHandler} name="variables" />
    </Route>
    <Route handler={AboutPage} name="about" />
    <DefaultRoute handler={HomePage} name="home" />
    <NotFoundRoute handler={NotFoundPage} />
  </Route>
);


export default {fetchData, routes};
