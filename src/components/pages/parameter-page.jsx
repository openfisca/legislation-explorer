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
    currency: PropTypes.string.isRequired,
    parameter: AppPropTypes.parameter.isRequired,
  },
  render() {
    var {currency, parameter} = this.props;
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
                    {unit === "currency" && ` - ${currency}`}
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
            {this.renderStartStopValues(bracket.threshold)}
          </dd>
          <dt>Taux</dt>
          <dd>
            {this.renderStartStopValues(bracket.rate)}
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
  renderStartStopValue(start, stop, value, idx) {
    if (typeof value === "number") {
      var [integerPart, decimalPart] = value.toString().split(".");
      var {currency, parameter} = this.props;
      var {unit} = parameter;
    }
    return (
      <tr key={idx}>
        <td>
          <FormattedMessage
            message="du {start} au {stop}"
            start={<FormattedDate format="short" value={start} />}
            stop={<FormattedDate format="short" value={stop} />}
          />
        </td>
        <td style={{width: "15em"}}>
          <samp>
            {
              typeof value === "number" ? React.addons.createFragment({
                integerPart: (
                  <span style={{
                    display: "inline-block",
                    textAlign: "right",
                    width: "5em",
                  }}>
                    {integerPart}
                  </span>
                ),
                separator: decimalPart && ".",
                decimalPart,
              }) : JSON.stringify(value)
            }
          </samp>
          {
            unit === "currency" && (
              <span className="pull-right" style={{marginRight: "1em"}}>
                {" "}
                <samp>{currency}</samp>
              </span>
            )
          }
        </td>
      </tr>
    );
  },
  renderStartStopValues(values) {
    return (
      <table className="table table-bordered table-hover table-striped">
        <tbody>
          {values.map((value, idx) => this.renderStartStopValue(value.start, value.stop, value.value, idx))}
        </tbody>
      </table>
    );

  },
  renderValues(values) {
    return (
      <div>
        <h4>Valeurs</h4>
        {this.renderStartStopValues(values)}
      </div>
    );
  },
});


export default ParameterPage;
