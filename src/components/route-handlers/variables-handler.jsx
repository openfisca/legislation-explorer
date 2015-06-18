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
import React, {PropTypes} from "react";

import AppPropTypes from "../../app-prop-types";
import BreadCrumb from "../breadcrumb";
import VariablesPage from "../pages/variables-page";
import webservices from "../../webservices";


var VariablesHandler = React.createClass({
  propTypes: {
    dataByRouteName: PropTypes.shape({
      variables: PropTypes.shape({
        variables: PropTypes.arrayOf(AppPropTypes.variable).isRequired,
      }),
    }),
    errorByRouteName: PropTypes.shape({
      variables: PropTypes.instanceOf(Error),
    }),
    loading: AppPropTypes.loading,
  },
  statics: {
    fetchData() {
      return webservices.fetchVariables();
    },
  },
  render() {
    var {dataByRouteName, errorByRouteName} = this.props;
    var error = errorByRouteName && errorByRouteName.variables;
    var data = dataByRouteName && dataByRouteName.variables;
    return (
      <DocumentTitle title="Variables - Explorateur de la législation">
        <div>
          <BreadCrumb>
            <li className="active">Variables</li>
          </BreadCrumb>
          <div className="page-header">
            <h1>Variables et formules socio-fiscales</h1>
          </div>
          {this.renderContent(error, data)}
        </div>
      </DocumentTitle>
    );
  },
  renderContent(error, data) {
    var content;
    if (error) {
      content = (
        <div className="alert alert-danger">
          Impossible de charger les données depuis l'API.
        </div>
      );
    } else if (this.props.loading) {
      content = (
        <p>Chargement en cours…</p>
      );
    } else if (data) {
      content = (
        <VariablesPage variables={data.variables} />
      );
    }
    return content;
  },
});


export default VariablesHandler;
