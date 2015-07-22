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


// App config the for development environment.
// Do not require this directly. Use ./src/config instead.


import prodConfig from "./prod";


const WEBPACK_HOST = process.env.HOST || "localhost";


export default {
  apiBaseUrl: `http://${WEBPACK_HOST}:2000`,
  gitWebpageUrl: prodConfig.gitWebpageUrl,
  websiteUrl: `http://${WEBPACK_HOST}:2010/`,
};
