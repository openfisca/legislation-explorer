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


import React from "react/addons";
import url from "url";

import config from "../config";


var NavBar = React.createClass({
  mixins: [React.addons.PureRenderMixin],
  render() {
    return (
      <div className="navbar navbar-inverse navbar-static-top" role="navigation">
        <div className="container">
          <div className="navbar-header">
            <button
              className="navbar-toggle"
              data-target=".navbar-responsive-collapse"
              data-toggle="collapse"
              type="button"
            >
              <span className="sr-only">Basculer la navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href={config.websiteUrl}>OpenFisca</a>
          </div>
          <div className="collapse navbar-collapse navbar-responsive-collapse">
            <ul className="nav navbar-nav">
              <li><a href={url.resolve(config.websiteUrl, "/presentation")}>Présentation</a></li>
              <li><a href={url.resolve(config.websiteUrl, "/documentation")}>Documentation</a></li>
              <li><a href={url.resolve(config.websiteUrl, "/outils")}>Outils</a></li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li><a href={url.resolve(config.websiteUrl, "/a-propos")}>À propos</a></li>
              <li><a href={url.resolve(config.websiteUrl, "/contact")}>Contact</a></li>
            </ul>
          </div>
        </div>
      </div>
    );
  },
});


export default NavBar;
