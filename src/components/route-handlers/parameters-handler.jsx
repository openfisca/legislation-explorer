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


import React, {PropTypes} from "react/addons";

import AppPropTypes from "../../app-prop-types";
import BreadCrumb from "../breadcrumb";
import ParametersPage from "../pages/parameters-page";
import webservices from "../../webservices";


var ParametersHandler = React.createClass({
  propTypes: {
    dataByRouteName: PropTypes.shape({
      parameters: PropTypes.shape({
        parameters: PropTypes.arrayOf(AppPropTypes.parameter).isRequired,
      }),
    }),
    errorByRouteName: PropTypes.shape({
      parameters: PropTypes.instanceOf(Error),
    }),
    loading: AppPropTypes.loading,
  },
  statics: {
    fetchData() {
      return webservices.fetchParameters();
    },
  },
  render() {
    var {dataByRouteName, errorByRouteName} = this.props;
    var error = errorByRouteName && errorByRouteName.parameters;
    var data = dataByRouteName && dataByRouteName.parameters;
    return (
      <div>
        <BreadCrumb>
          <li className="active">Paramètres</li>
        </BreadCrumb>
        <div className="page-header">
          <h1>Paramètres de la législation</h1>
        </div>
        {this.renderContent(error, data)}
      </div>
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
        <ParametersPage parameters={data.parameters} />
      );
    }
    return content;
  },
});


export default ParametersHandler;
