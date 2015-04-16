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


// Polyfill, loaded at the very first.
require("babel-core/polyfill");


import {EventEmitter} from "events";
import React from "react";
import Router from "react-router";

import {fetchData, routes} from "./routes";


if (process.env.NODE_ENV === "development") {
  var myDebug = require("debug");
  myDebug.enable("app:*");
  window.myDebug = myDebug;
}


function renderApp() {
  global.loadingEvents = new EventEmitter();
  const appMountNode = document.getElementById("app-mount-node");
  Router.run(routes, Router.HistoryLocation, (Handler, state) => {
    global.loadingEvents.emit("loadStart");
    fetchData(state.routes, state.params, state.query).then(
      data => React.render(<Handler {...data} />, appMountNode),
      errors => React.render(<Handler errorByRouteName={errors} />, appMountNode)
    ).then(
      () => global.loadingEvents.emit("loadEnd")
    );
  });
}


renderApp();
