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
import React, {PropTypes} from "react/addons";

import AppPropTypes from "../../app-prop-types";


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
            <ul>
              {
                parameters.map((parameter, idx) => (
                  <li key={idx}>
                    <Link params={parameter} to="parameter">{parameter.name}</Link>
                    {" : "}
                    {parameter.description || "Aucune description"}
                  </li>
                ))
              }
            </ul>
          )
        }
      </div>
    );
  },
});


export default ParametersPage;
