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


import {Link, State} from "react-router";
import DocumentTitle from "react-document-title";
import React, {PropTypes} from "react/addons";

import AppPropTypes from "../../app-prop-types";
import BreadCrumb from "../breadcrumb";
import VariablePage from "../pages/variable-page";
import webservices from "../../webservices";


var VariableHandler = React.createClass({
  mixins: [State],
  propTypes: {
    appState: PropTypes.object,
    errorByRouteName: PropTypes.objectOf(PropTypes.object),
    variable: PropTypes.shape({
      git_commit_sha: PropTypes.string.isRequired,
      value: AppPropTypes.variable.isRequired,
    }),
  },
  statics: {
    fetchData(params) {
      return webservices.fetchField(params.name);
    },
  },
  render() {
    var name = this.getParams().name;
    return (
      <DocumentTitle title={`${name} - Explorateur de la légisation`}>
        <div>
          <BreadCrumb>
            <li>
              <Link to="variables">Variables</Link>
            </li>
            <li className="active">{name}</li>
          </BreadCrumb>
          {
            !this.props.variable && (
              <div className="page-header">
                <h1>{name}</h1>
              </div>
            )
          }
          {this.renderContent()}
        </div>
      </DocumentTitle>
    );
  },
  renderContent() {
    var content;
    if (this.props.appState.loading) {
      content = (
        <p>Chargement…</p>
      );
    } else if (this.props.errorByRouteName && this.props.errorByRouteName.variable) {
      content = (
        <p>Unable to fetch data from API.</p>
      );
    } else if (this.props.variable) {
      var routeData = this.props.variable;
      var variable = Object.assign(routeData.value, {modulePath: routeData.value.module.split(".")});
      content = (
        <VariablePage gitCommitSha={routeData.git_commit_sha} variable={variable} />
      );
    }
    return content;
  },
});


export default VariableHandler;
