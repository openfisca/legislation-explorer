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

import {FormattedDate, FormattedMessage} from "react-intl";
import React from "react/addons";

import AppPropTypes from "../../app-prop-types";
import List from "../list";


var ParameterPage = React.createClass({
  propTypes: {
    parameter: AppPropTypes.parameter.isRequired,
  },
  render() {
    var {parameter} = this.props;
    var {brackets, description, format, unit, values} = parameter;
    return (
      <div>
        <p>{description}</p>
        {
          <dl className="dl-horizontal">
            <dt>Type</dt>
            <dd>{values ? "Paramètre" : "Barème"}</dd>
            {
              (format || unit) && React.addons.createFragment({
                formatDt: format && <dt>Format</dt>,
                formatDd: format && (
                  <dd>
                    <samp>{format}</samp>
                  </dd>
                ),
                unitDt: unit && <dt>Unité</dt>,
                unitDd: unit && (
                  <dd>
                    <samp>{unit}</samp>
                  </dd>
                ),
              })
            }
          </dl>
        }
        {brackets && this.renderBrackets(brackets)}
        {values && this.renderValues(values)}
      </div>
    );
  },
  renderBracket(bracket, idx, items) {
    return (
      <div>
        <dl className="dl-horizontal">
          <dt>Seuils</dt>
          <dd style={{marginBottom: "1em"}}>
            <List items={bracket.threshold} type="unstyled">
              {this.renderStartStopValue}
            </List>
          </dd>
          <dt>Taux</dt>
          <dd>
            <List items={bracket.rate} type="unstyled">
              {this.renderStartStopValue}
            </List>
          </dd>
        </dl>
        {idx < items.length - 1 && <hr />}
      </div>
    );
  },
  renderBrackets(brackets) {
    return (
      <div>
        <h4>Tranches</h4>
        <List items={brackets} type="unstyled">
          {this.renderBracket}
        </List>
      </div>
    );
  },
  renderStartStopValue(value) {
    return (
      <FormattedMessage
        message="du {start} au {stop} : {value}"
        start={<FormattedDate format="short" value={value.start} />}
        stop={<FormattedDate format="short" value={value.stop} />}
        value={<samp>{JSON.stringify(value.value)}</samp>}
      />
    );
  },
  renderValues(values) {
    return (
      <div>
        <h4>Valeurs</h4>
        <List items={values} type="unstyled">
          {this.renderStartStopValue}
        </List>
      </div>
    );
  },
});


export default ParameterPage;
