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

import AppPropTypes from "../../prop-types";
import VariablePage from "../pages/variable-page";
import webservices from "../../webservices";


var VariableHandler = React.createClass({
  propTypes: {
    appState: PropTypes.object,
    errorByRouteName: PropTypes.objectOf(PropTypes.object),
    variable: AppPropTypes.variable,
  },
  statics: {
    fetchData(params) {
      return webservices.fetchVariable(params.name).then(data => data.value);
    },
  },
  render() {
    var content;
    if (this.props.appState.loading) {
      content = this.props.appState.loading === "slow" ? (
        <p>Loading…</p>
      ) : null;
    } else if (this.props.errorByRouteName && this.props.errorByRouteName.variable) {
      content = (
        <p>Unable to fetch data from API.</p>
      );
    } else {
      content = (
        <VariablePage variable={this.props.variable} />
      );
    }
    return content;
  },
});


export default VariableHandler;
