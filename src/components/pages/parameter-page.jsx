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
import React, {PropTypes} from "react";

import AppPropTypes from "../../app-prop-types";
import GitHubLink from "../github-link";
import List from "../list";


var ParameterPage = React.createClass({
  propTypes: {
    countryPackageGitHeadSha: PropTypes.string.isRequired,
    currency: PropTypes.string.isRequired,
    parameter: AppPropTypes.parameter.isRequired,
    parametersUrlPath: PropTypes.string.isRequired,
  },
  render() {
    var {countryPackageGitHeadSha, currency, parameter, parametersUrlPath} = this.props;
    var {brackets, description, end_line_number, format, start_line_number, unit, values} = parameter;
    var type = parameter["@type"];
    return (
      <div>
        <p>{description}</p>
        {
          <dl className="dl-horizontal">
            <dt>Type</dt>
            <dd>{type === "Parameter" ? "Paramètre" : "Barème"}</dd>
            <dt>Format</dt>
            <dd>
              <samp>{format}</samp>
            </dd>
            {unit && <dt>Unité</dt>}
            {
              unit && (
                <dd>
                  <samp>{unit}</samp>
                  {unit === "currency" && ` - ${currency}`}
                </dd>
              )
            }
            <dt>Origine</dt>
            <dd>
              {`${parametersUrlPath.split("/").splice(-1)} ligne ${start_line_number} à ${end_line_number}`}
              <GitHubLink
                blobUrlPath={parametersUrlPath}
                commitReference={countryPackageGitHeadSha}
                endLineNumber={end_line_number}
                lineNumber={start_line_number}
                style={{marginLeft: "1em"}}
              >
                {children => <small>{children}</small>}
              </GitHubLink>
            </dd>
          </dl>
        }
        <div className="row">
          <div className="col-lg-8">
            {type === "Parameter" ? this.renderValues(values) : this.renderBrackets(brackets)}
          </div>
        </div>
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
  renderFloatValue(value) {
    var [integerPart, decimalPart] = value.toString().split(".");
    return (
      <span>
        <span style={{
          display: "inline-block",
          textAlign: "right",
          width: "5em",
        }}>
          {integerPart}
        </span>
        {decimalPart && "."}
        {decimalPart}
      </span>
    );
  },
  renderStartStopValue(valueJson, idx) {
    var {end_line_number, start, start_line_number, stop, value} = valueJson;
    var {countryPackageGitHeadSha, currency, parameter, parametersUrlPath} = this.props;
    var {format, unit} = parameter;
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
            {["float", "rate"].includes(format) ? this.renderFloatValue(value) : JSON.stringify(value)}
          </samp>
          {
            (format === "rate" || unit === "currency") && (
              <samp className="pull-right" style={{marginRight: "1em"}}>
                {format === "rate" ? "%" : currency}
              </samp>
            )
          }
        </td>
        <td>
          <GitHubLink
            blobUrlPath={parametersUrlPath}
            commitReference={countryPackageGitHeadSha}
            endLineNumber={end_line_number}
            lineNumber={start_line_number}
          >
            {children => <small>{children}</small>}
          </GitHubLink>
        </td>
      </tr>
    );
  },
  renderStartStopValues(values) {
    return (
      <table className="table table-bordered table-hover table-striped">
        <tbody>
          {values.map(this.renderStartStopValue)}
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
