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
import {Link} from "react-router";
import {sortAlphabetically} from "trine/iterable/sortAlphabetically";
import {sortAlphabeticallyBy} from "trine/iterable/sortAlphabeticallyBy";
import {to} from "trine/iterable/to";
import React, {PropTypes} from "react";

import AppPropTypes from "../../app-prop-types";
import ExternalLink from "../external-link";
import FormulaSource from "../formula-source";
import GitHubLink from "../github-link";
import Highlight from "../highlight";
import List from "../list";


var VariablePage = React.createClass({
  propTypes: {
    computedVariables: PropTypes.arrayOf(AppPropTypes.variable).isRequired,
    countryPackageGitHeadSha: PropTypes.string.isRequired,
    parameters: PropTypes.arrayOf(AppPropTypes.parameterOrScale).isRequired,
    variable: AppPropTypes.variable.isRequired,
  },
  getParameterValue(parameter, instant) {
    const type = parameter["@type"];
    const isBetween = item => item.start <= instant && item.stop >= instant;
    if (type === "Parameter") {
      return (parameter.values.find(isBetween) || parameter.values[0]).value;
    } else {
      // type === "Scale"
      return null;
    }
  },
  getTodayInstant() {
    return new Date().toJSON().slice(0, 10);
  },
  render() {
    const {countryPackageGitHeadSha, variable} = this.props;
    var {formula, label, line_number, module, name} = variable;
    return (
      <div>
        <p>
          {
            label && label !== name ?
              label : (
                <GitHubLink
                  blobUrlPath={`${module.split(".").join("/")}.py`}
                  className="label label-warning"
                  commitReference={countryPackageGitHeadSha}
                  lineNumber={line_number}
                  style={{marginLeft: "1em"}}
                  text="Aucun libellé"
                  title="Ajouter un libellé via GitHub"
                />
              )
          }
        </p>
        {this.renderVariableDefinitionsList()}
        <hr />
        {
          formula && (
            formula["@type"] === "DatedFormula" ?
              this.renderDatedFormula(formula) :
              this.renderSimpleFormula(formula)
          )
        }
      </div>
    );
  },
  renderConsumerVariables() {
    const {computedVariables, variable} = this.props;
    const isConsumerVariable = variable2 => variable2.formula.input_variables &&
      variable2.formula.input_variables.includes(variable.name);
    const consumerVariables = computedVariables.filter(isConsumerVariable);
    function prop(propName) {
      return function() {
        return this[propName];
      };
    }
    function sortByName() {
      return this::sortAlphabeticallyBy(prop("name"))::to(Array);
    }
    return [
      <dt key="dt">Variables appelantes</dt>,
      <dd key="dd">
        {
          consumerVariables && consumerVariables.length ? (
            <List items={consumerVariables::sortByName()} type="inline">
              {variable2 => <Link params={variable2} to="variable">{variable2.name}</Link>}
            </List>
          ) : (
            <span className="label label-warning">Aucune</span>
          )
        }
      </dd>,
    ];
  },
  renderDatedFormula(formula) {
    return formula.dated_formulas.map((datedFormula, idx) => (
      <div key={idx}>
        <h4 style={{display: "inline-block"}}>
          {this.renderDatedFormulaHeading(datedFormula)}
        </h4>
        {this.renderFormula(datedFormula.formula)}
        <hr />
      </div>
    ));
  },
  renderDatedFormulaHeading(formula) {
    var heading;
    if (formula.start_instant && formula.stop_instant) {
      heading = (
        <FormattedMessage
          message="Formule de calcul du {start} au {stop}"
          start={<FormattedDate format="short" value={formula.start_instant} />}
          stop={<FormattedDate format="short" value={formula.stop_instant} />}
        />
      );
    } else if (formula.start_instant) {
      heading = (
        <FormattedMessage
          message="Formule de calcul depuis le {start}"
          start={<FormattedDate format="short" value={formula.start_instant} />}
        />
      );
    } else if (formula.stop_instant) {
      heading = (
        <FormattedMessage
          message="Formule de calcul jusqu'au {stop}"
          stop={<FormattedDate format="short" value={formula.stop_instant} />}
        />
      );
    }
    return heading;
  },
  renderFormula(formula) {
    const inputVariableNames = formula.input_variables;
    const formulaParameterNames = formula.parameters;
    return (
      <div>
        {
          (inputVariableNames || formulaParameterNames) && (
            <dl className="dl-horizontal">
              {inputVariableNames && <dt>Variables d'entrée</dt>}
              {
                inputVariableNames && (
                  <dd style={{marginBottom: "1em"}}>
                    <List items={inputVariableNames::sortAlphabetically()::to(Array)} type="inline">
                      {name => <Link params={{name}} to="variable">{name}</Link>}
                    </List>
                  </dd>
                )
              }
              {formulaParameterNames && <dt>Paramètres</dt>}
              {
                formulaParameterNames && (
                  <dd>
                    <List items={formulaParameterNames::sortAlphabetically()::to(Array)} type="inline">
                      {
                        (parameterName) => {
                          const {parameters} = this.props;
                          const parameter = parameters.find(parameter2 => parameter2.name === parameterName);
                          return parameter ? (
                            <span>
                              <Link params={{name: parameterName}} to="parameter">{parameterName}</Link>
                              {" "}
                              ({this.renderParameterValue(parameter)})
                            </span>
                          ) : (
                            <span>
                              {parameterName}
                              {" "}
                              <span className="label label-warning">inexistant</span>
                            </span>
                          );
                        }
                      }
                    </List>
                  </dd>
                )
              }
            </dl>
          )
        }
        <div style={{position: "relative"}}>
          <Highlight language="python">
            <FormulaSource inputVariableNames={inputVariableNames}>
              {formula.source}
            </FormulaSource>
          </Highlight>
          <GitHubLink
            blobUrlPath={`${formula.module.split(".").join("/")}.py`}
            commitReference={this.props.countryPackageGitHeadSha}
            endLineNumber={formula.line_number + formula.source.trim().split("\n").length - 1}
            lineNumber={formula.line_number}
            style={{
              position: "absolute",
              right: "0.5em",
              top: "0.3em",
            }}
          >
            {children => <small>{children}</small>}
          </GitHubLink>
        </div>
      </div>
    );
  },
  renderParameterValue(parameter) {
    // TODO extract value component from ParameterPage.renderValue
    return (
      <samp>
        {this.getParameterValue(parameter, this.getTodayInstant())}
      </samp>
    );
  },
  renderSimpleFormula(formula) {
    return (
      <div>
        <h4 style={{display: "inline-block"}}>Formule de calcul</h4>
        {this.renderFormula(formula)}
      </div>
    );
  },
  renderVariableDefinitionsList() {
    var {countryPackageGitHeadSha, variable} = this.props;
    var entityLabelByNamePlural = {
      familles: "Famille",
      "foyers_fiscaux": "Foyer fiscal",
      individus: "Individu",
      menages: "Ménage",
    };
    var type = variable["@type"];
    return (
      <dl className="dl-horizontal">
        <dt>Entité</dt>
        <dd>{entityLabelByNamePlural[variable.entity]}</dd>
        <dt>Type</dt>
        <dd>
          <code>{type}</code>
          {variable.val_type && ` (${variable.val_type})`}
        </dd>
        {type === "Enumeration" && <dt>Libellés</dt>}
        {
          type === "Enumeration" && (
            <dd>
              <List items={Object.entries(variable.labels)} type="unstyled">
                {entry => `${entry[0]} = ${entry[1]}`}
              </List>
            </dd>
          )
        }
        <dt>Valeur par défaut</dt>
        <dd><samp>{variable.default}</samp></dd>
        {
          variable.cerfa_field && [
            <dt key="dt">Cases CERFA</dt>,
            <dd key="dd">
              {
                typeof variable.cerfa_field === "string" ?
                  variable.cerfa_field :
                  Object.values(variable.cerfa_field).join(", ")
              }
            </dd>,
          ]
        }
        {
          variable.start && [
            <dt key="dt">Démarre le</dt>,
            <dd key="dd">
              <FormattedDate format="short" value={variable.start} />
            </dd>,
          ]
        }
        {
          variable.url && [
            <dt key="dt">URL externe</dt>,
            <dd key="dd">
              <ExternalLink href={variable.url}>
                {variable.url}
              </ExternalLink>
            </dd>,
          ]
        }
        <dt>Code source</dt>
        <dd>
          {
            () => {
              var sourceCodeText = variable.module;
              if (variable.line_number) {
                sourceCodeText += ` ligne ${variable.line_number}`;
              }
              return sourceCodeText;
            }()
          }
          <GitHubLink
            blobUrlPath={`${variable.module.split(".").join("/")}.py`}
            commitReference={countryPackageGitHeadSha}
            lineNumber={variable.line_number}
            style={{marginLeft: "1em"}}
          >
            {children => <small>{children}</small>}
          </GitHubLink>
        </dd>
        {this.renderConsumerVariables()}
      </dl>
    );
  },
});


export default VariablePage;
