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

import AppPropTypes from "../../app-prop-types";
import ListInline from "../list-inline";


var ParameterPage = React.createClass({
  propTypes: {
    parameter: AppPropTypes.parameter.isRequired,
  },
  render() {
    var {parameter} = this.props;
    var {description} = parameter;
    var type = parameter["@type"];
    return (
      <div>
        <p>{description}</p>
        <dl className="dl-horizontal">
          <dt>Type</dt>
          <dd>
            <code>{type}</code>
          </dd>
        </dl>
        <pre>
          {JSON.stringify(this.props.parameter, null, 2)}
        </pre>
      </div>
    );
  },
});


export default ParameterPage;
