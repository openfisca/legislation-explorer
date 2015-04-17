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


import DocumentTitle from "react-document-title";
import {Link} from "react-router";
import React from "react";
import url from "url";

import AppPropTypes from "../../prop-types";
import config from "../../config";


var VariablesPage = React.createClass({
  propTypes: {
    variable: AppPropTypes.variable.isRequired,
  },
  render() {
    var {label, name} = this.props.variable;
    return (
      <DocumentTitle title={`${label} (${name}) - Explorateur de la légisation`}>
        <div>
          {this.renderBreadcrumb()}
          <div className="page-header">
            <h1>{`${label} (${name})`}</h1>
          </div>
          <Link to="variables">Retour</Link>
          <p>
            {JSON.stringify(this.props.variable)}
          </p>
        </div>
      </DocumentTitle>
    );
  },
  renderBreadcrumb() {
    var {label, name} = this.props.variable;
    return (
      <ul className="breadcrumb">
        <li>
          <a href={config.websiteUrl}>Accueil</a>
        </li>
        <li>
          <a href={url.resolve(config.websiteUrl, "/outils")}>Outils</a>
        </li>
        <li>
          <Link to="variables">Explorateur de la législation</Link>
        </li>
        <li className="active">{`${label} (${name})`}</li>
      </ul>
    );
  },
});


export default VariablesPage;
