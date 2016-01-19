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


import config from "./config";


const debug = require("debug")("app:webservices");


// Fetch polyfill

function loadFetch() {
  if (process.env.BROWSER) {
    if (window.fetch) {
      return window.fetch;
    } else {
      require("whatwg-fetch");
      return window.fetch;
    }
  } else {
    return require("node-fetch");
  }
}
var fetch = loadFetch();


// Generic fetch functions

var dataByUrl = new Map();


function fetchCachedJson(url, options) {
  if (dataByUrl.has(url)) {
    debug("Found data in cache for URL", url);
    return Promise.resolve(dataByUrl.get(url));
  } else {
    return fetchJson(url, options)
      .then(data => {
        dataByUrl.set(url, data);
        return data;
      });
  }
}


function fetchJson(url, options) {
  return loggedFetch(url, options).then(parseJsonResponse);
}


function loggedFetch(url, ...args) {
  debug("About to fetch URL", url);
  return fetch(url, ...args);
}


async function parseJsonResponse(response) {
  const data = await response.json();
  if (response.status >= 200 && response.status < 300) {
    return data;
  } else {
    throw new Error(JSON.stringify(data.error));
  }
}


// API fetch functions

function fetchParameters(apiBaseUrl = config.apiBaseUrl) {
  return fetchCachedJson(`${apiBaseUrl}/api/1/parameters`);
}


function fetchVariables(apiBaseUrl = config.apiBaseUrl) {
  return fetchCachedJson(`${apiBaseUrl}/api/1/variables`);
}


export default {fetchParameters, fetchVariables};
