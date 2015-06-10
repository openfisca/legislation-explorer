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
import {IntlMixin} from "react-intl";
import moment from "moment";
import React, {PropTypes} from "react";

import AppPropTypes from "../../app-prop-types";
import GitHubLink from "../github-link";
import List from "../list";


var ParameterPage = React.createClass({
  mixins: [IntlMixin],
  propTypes: {
    countryPackageGitHeadSha: PropTypes.string.isRequired,
    currency: PropTypes.string.isRequired,
    parameter: AppPropTypes.parameterOrScale.isRequired,
    parametersUrlPath: PropTypes.string.isRequired,
  },
  getBracketsForPeriod(brackets, period) {
    var doesPeriodMatch = bracket => bracket.start === period.start && bracket.stop === period.stop;
    var rates = [];
    var thresholds = [];
    brackets.forEach(bracket => {
      rates = rates.concat(bracket.rate.filter(doesPeriodMatch).map(rate => rate.value));
      thresholds = thresholds.concat(bracket.threshold.filter(doesPeriodMatch).map(rate => rate.value));
    });
    var bracketsForPeriod = rates.map((rate, idx) => ({rate, threshold: thresholds[idx]}));
    return bracketsForPeriod;
  },
  getDatedScale(brackets, instant) {
    const isBetween = item => item.start <= instant && item.stop >= instant;
    return brackets.reduce((memo, bracket) => {
      const rate = bracket.rate.find(isBetween);
      const threshold = bracket.threshold.find(isBetween);
      if (rate && threshold) {
        memo.push({rate, threshold});
      }
      return memo;
    }, []);
  },
  getInitialState() {
    const datedScaleInstant = new Date().toJSON().slice(0, 10);
    return {
      datedScaleInstant,
      datedScaleInstantText: this.formatDate(datedScaleInstant),
    };
  },
  handleDatedScaleInstantChange(event) {
    const datedScaleInstantText = event.target.value;
    this.setState({datedScaleInstantText});
  },
  handleDatedScaleInstantSubmit(event) {
    event.preventDefault();
    const {datedScaleInstantText} = this.state;
    const datedScaleInstant = moment(datedScaleInstantText, "DD/MM/YYYY").format("YYYY-MM-DD");
    this.setState({datedScaleInstant});
  },
  render() {
    var {countryPackageGitHeadSha, currency, parameter, parametersUrlPath} = this.props;
    var {brackets, description, end_line_number, format, start_line_number, unit, values} = parameter;
    var type = parameter["@type"];
    var fileName = parametersUrlPath.split("/").splice(-1);
    return (
      <div>
        <p>{description}</p>
        {
          <dl className="dl-horizontal">
            <dt>Type</dt>
            <dd>{type === "Parameter" ? "Paramètre" : "Barème"}</dd>
            {format && <dt>Format</dt>}
            {
              format && (
                <dd>
                  <samp>{format}</samp>
                </dd>
              )
            }
            {unit && <dt>{type === "Parameter" ? "Unité" : "Unité des seuils"}</dt>}
            {
              unit && (
                <dd>
                  <samp>{unit}</samp>
                  {unit === "currency" && ` - ${currency}`}
                </dd>
              )
            }
            <dt>Code source</dt>
            <dd>
              {
                end_line_number ?
                  `${fileName} ligne ${start_line_number} à ${end_line_number}` :
                  `${fileName} ligne ${start_line_number}`
                }
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
            {type === "Parameter" ? this.renderParameter(values) : this.renderScale(brackets)}
          </div>
        </div>
      </div>
    );
  },
  renderBracket(bracket, idx) {
    var {parameter} = this.props;
    var {brackets, format, unit} = parameter;
    return (
      <div>
        <dl className="dl-horizontal">
          <dt>Seuils</dt>
          <dd style={{marginBottom: "1em"}}>
            {this.renderStartStopValues(bracket.threshold, format, unit)}
          </dd>
          <dt>Taux</dt>
          <dd>
            {this.renderStartStopValues(bracket.rate, "rate")}
          </dd>
        </dl>
        {idx < brackets.length - 1 && <hr />}
      </div>
    );
  },
  renderDatedScale(datedScale) {
    var {countryPackageGitHeadSha, parameter, parametersUrlPath} = this.props;
    var {format, unit} = parameter;
    return (
      <div>
        <table className="table table-bordered table-hover table-striped">
          <thead>
            <tr>
              <th>Seuils</th>
              <th>Taux</th>
            </tr>
          </thead>
          <tbody>
            {
              datedScale.map((datedBracket, idx) => (
                <tr key={idx}>
                  <td>
                    {this.renderValue(datedBracket.threshold.value, format, unit)}
                    <GitHubLink
                      blobUrlPath={parametersUrlPath}
                      className="pull-right"
                      commitReference={countryPackageGitHeadSha}
                      endLineNumber={datedBracket.threshold.end_line_number}
                      lineNumber={datedBracket.threshold.start_line_number}
                      text={null}
                      title="Voir la valeur sur GitHub"
                    >
                      {children => <small>{children}</small>}
                    </GitHubLink>
                  </td>
                  <td>
                    {this.renderValue(datedBracket.rate.value, "rate")}
                    <GitHubLink
                      blobUrlPath={parametersUrlPath}
                      className="pull-right"
                      commitReference={countryPackageGitHeadSha}
                      endLineNumber={datedBracket.rate.end_line_number}
                      lineNumber={datedBracket.rate.start_line_number}
                      text={null}
                      title="Voir la valeur sur GitHub"
                    >
                      {children => <small>{children}</small>}
                    </GitHubLink>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    );
  },
  renderFloatValue(value) {
    const decimalPartLength = 3;
    var [integerPart, decimalPart] = value.toFixed(decimalPartLength).toString().split(".");
    if (decimalPart === "0".repeat(decimalPartLength)) {
      decimalPart = null;
    }
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
  renderParameter(values) {
    var {parameter} = this.props;
    var {format, unit} = parameter;
    return (
      <div>
        <h4>Valeurs</h4>
        {this.renderStartStopValues(values, format, unit)}
      </div>
    );
  },
  renderScale(brackets) {
    const {datedScaleInstant, datedScaleInstantText} = this.state;
    const datedScale = this.getDatedScale(brackets, datedScaleInstant);
    return (
      <div>
        <h4>
          <form onSubmit={this.handleDatedScaleInstantSubmit}>
            <FormattedMessage
              instant={
                <input
                  onBlur={this.handleDatedScaleInstantSubmit}
                  onChange={this.handleDatedScaleInstantChange}
                  type="text"
                  value={datedScaleInstantText}
                />
              }
              message="Barème au {instant}"
            />
          </form>
        </h4>
        {this.renderDatedScale(datedScale)}
        <h4>Tranches</h4>
        <List items={brackets} type="unstyled">
          {this.renderBracket}
        </List>
      </div>
    );
  },
  renderStartStopValue(valueJson, format, unit, idx) {
    var {end_line_number, start, start_line_number, stop, value} = valueJson;
    var {countryPackageGitHeadSha, parametersUrlPath} = this.props;
    return (
      <tr key={idx}>
        <td>
          <FormattedMessage
            message="{start} - {stop}"
            start={<FormattedDate format="short" value={start} />}
            stop={<FormattedDate format="short" value={stop} />}
          />
        </td>
        <td>
          {this.renderValue(value, format, unit)}
          <GitHubLink
            blobUrlPath={parametersUrlPath}
            className="pull-right"
            commitReference={countryPackageGitHeadSha}
            endLineNumber={end_line_number}
            lineNumber={start_line_number}
            text={null}
            title="Voir la valeur sur GitHub"
          >
            {children => <small>{children}</small>}
          </GitHubLink>
        </td>
      </tr>
    );
  },
  renderStartStopValues(values, format, unit) {
    return (
      <table className="table table-bordered table-hover table-striped">
        <tbody>
          {values.map((value, idx) => this.renderStartStopValue(value, format, unit, idx))}
        </tbody>
      </table>
    );
  },
  renderValue(value, format, unit) {
    var {currency} = this.props;
    return (
      <span>
        <samp>
          {
            format === "rate" ? this.renderFloatValue(value * 100) :
            format !== "boolean" ? this.renderFloatValue(value) :
            value.toString()
          }
        </samp>
        {
          (format === "rate" || unit === "currency") && (
            <samp style={{marginLeft: "0.3em"}}>
              {format === "rate" ? "%" : currency}
            </samp>
          )
        }
      </span>
    );
  },
});


export default ParameterPage;
