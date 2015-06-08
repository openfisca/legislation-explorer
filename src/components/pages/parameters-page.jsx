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


import {Link} from "react-router";
import Immutable from "immutable";
import React, {PropTypes} from "react";

import AppPropTypes from "../../app-prop-types";
import List from "../list";


var ParametersPage = React.createClass({
  propTypes: {
    parameters: PropTypes.arrayOf(AppPropTypes.parameter).isRequired,
  },
  render() {
    var {parameters} = this.props;
    parameters = Immutable.fromJS(parameters).sortBy(parameter => parameter.get("name")).toJS();
    return (
      <div>
        {
          parameters && (
            <List items={parameters}>
              {this.renderParameter}
            </List>
          )
        }
      </div>
    );
  },
  renderParameter(parameter) {
    var type = parameter["@type"];
    return (
      <span>
        <Link params={parameter} to="parameter">{parameter.name}</Link>
        {" "}
        {type === "Scale" && <span className="label label-info">Barème</span>}
        {" : "}
        {parameter.description || "Aucune description"}
      </span>
    );
  },
});


export default ParametersPage;
