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


import React, {PropTypes} from "react";

import AppPropTypes from "../../prop-types";
import VariablesPage from "../pages/variables-page";
import webservices from "../../webservices";


var VariablesHandler = React.createClass({
  propTypes: {
    appState: PropTypes.object,
    errors: PropTypes.objectOf(PropTypes.object),
    variables: PropTypes.objectOf(PropTypes.arrayOf(AppPropTypes.variable)),
  },
  statics: {
    fetchData() {
      return webservices.fetchVariables();
    },
  },
  render() {
    var content;
    if (this.props.appState.loading) {
      content = this.props.appState.loading === "slow" ? (
        <p>Loading…</p>
      ) : null;
    } else if (this.props.errors && this.props.errors.variables) {
      content = (
        <p>Unable to fetch data from API.</p>
      );
    } else {
      content = (
        <VariablesPage
          inputVariables={this.props.variables.inputVariables}
          outputVariables={this.props.variables.outputVariables}
        />
      );
    }
    return content;
  },
});


export default VariablesHandler;
