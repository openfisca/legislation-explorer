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


import Immutable from "immutable";
import React, {PropTypes} from "react/addons";

import AppPropTypes from "../../app-prop-types";
import BreadCrumb from "../breadcrumb";
import VariablesPage from "../pages/variables-page";
import webservices from "../../webservices";


var VariablesHandler = React.createClass({
  propTypes: {
    appState: PropTypes.object,
    errorByRouteName: PropTypes.objectOf(PropTypes.object),
    variables: PropTypes.arrayOf(AppPropTypes.variable),
  },
  statics: {
    fetchData() {
      return webservices.fetchFields().then(data => Immutable.fromJS(data.columns)
        // TODO Replace is_input with variable.formula?
        .map(variable => variable.set("is_input", true))
        .merge(data.prestations)
        .valueSeq()
        .sortBy(variable => variable.get("name"))
        .map(variable => variable.set("modulePath", variable.get("module").split(".")))
        .toJS()
      );
    },
  },
  render() {
    return (
      <div>
        {this.renderBreadcrumb()}
        <div className="page-header">
          <h1>Variables et formules socio-fiscales</h1>
        </div>
        {this.renderContent()}
      </div>
    );
  },
  renderBreadcrumb() {
    return (
      <BreadCrumb>
        <li className="active">Variables</li>
      </BreadCrumb>
    );
  },
  renderContent() {
    var content;
    if (this.props.appState.loading) {
      content = this.props.appState.loading === "slow" ? (
        <p>Loading…</p>
      ) : null;
    } else if (this.props.errorByRouteName && this.props.errorByRouteName.variables) {
      content = (
        <p>Unable to fetch data from API.</p>
      );
    } else {
      content = (
        <VariablesPage variables={this.props.variables} />
      );
    }
    return content;
  },
});


export default VariablesHandler;
