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

import {EventEmitter} from "events";
import moment from "moment";
import React from "react";
import Router from "react-router";


// Polyfills, loaded at the very first.

require("babel-core/polyfill");

import hljs from "highlight.js/lib/highlight";
hljs.registerLanguage("python", require("highlight.js/lib/languages/python"));

import {intlData, polyfillIntl} from "./intl";
polyfillIntl(renderApp);

moment.locale(intlData.locales.slice(0, 2));


const error = require("debug")("app:client");
error.log = console.error.bind(console);


function renderApp() {
  // Load routes after Intl polyfill since App component imports Intl mixin.
  var {fetchData, routes} = require("./routes");

  global.loadingEvents = new EventEmitter();
  const appMountNode = document.getElementById("app-mount-node");
  Router.run(routes, Router.HistoryLocation, (Root, state) => {
    if (window.isPageRenderedOnServer) {
      window.isPageRenderedOnServer = false;
    } else {
      React.render(<Root {...intlData} />, appMountNode);
    }
    global.loadingEvents.emit("loadStart");
    fetchData(state.routes, state.params, state.query)
      .then(
        dataByRouteName => {
          React.render(<Root dataByRouteName={dataByRouteName} {...intlData} />, appMountNode);
        },
        errorByRouteName => {
          React.render(<Root errorByRouteName={errorByRouteName} {...intlData} />, appMountNode);
          error("errorByRouteName", errorByRouteName);
        }
      )
      .then(
        () => global.loadingEvents.emit("loadEnd")
      );
  });
}
