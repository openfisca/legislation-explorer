import DocumentTitle from "react-document-title"
import { FormattedDate } from "react-intl"
import { Link } from "react-router"
import React, { PropTypes } from "react"
import { substract, sort, sortBy, prop } from "ramda"

import config from "../config"
import * as AppPropTypes from "../app-prop-types"
import ExternalLink from "./external-link"
import GitHubLink from "./github-link"
import List from "./list"



function isConsumerVariable(variable, name) {
  // Does `variable` consume `name` as an input variable?
  function isConsumerFormula(formula) {
    return formula.input_variables && formula.input_variables.includes(name)
  }
  const {formula} = variable
  if (!formula) {
    return false
  }
  switch (formula["@type"]) {
    case "SimpleFormula":
      return isConsumerFormula(formula)
    case "DatedFormula":
      return formula.dated_formulas.some(dated_formula => isConsumerFormula(dated_formula.formula))
    case "EntityToPerson":
    case "PersonToEntity":
      // Ignore those variable types since they have an implicit formula, not using any variable of the legislation.
      return false
    default:
      console.error("Unexpected formula type:", formula["@type"])
      return false
  }
}


const Variable = React.createClass({
  propTypes: {
    countryPackageName: PropTypes.string.isRequired,
    countryPackageVersion: PropTypes.string.isRequired,
    parameters: PropTypes.objectOf(AppPropTypes.parameterOrScale).isRequired,
    variable: AppPropTypes.variable.isRequired,
    variables: PropTypes.arrayOf(AppPropTypes.variable).isRequired,
  },
  getTodayInstant() {
    return new Date().toJSON().slice(0, 10)
  },
  render() {
    const {variable} = this.props
    const {formula, label, source_code} = variable
    const labelMessage = label || `${variable.name} (aucun label)`
    return (
      <DocumentTitle title={`${labelMessage} - Explorateur de la législation`}>
        <div>
          <div className="page-header">
            <h1>{labelMessage}</h1>
          </div>
          {this.renderDefinitionsLists(variable)}
          {formula && <hr />}
          {
            formula && (
              formula["@type"] === "DatedFormula"
                ? this.renderDatedFormula(formula)
                : this.renderSimpleFormula(formula)
            )
          }
          <hr />
          <h4>Code source</h4>
          <pre>{source_code}</pre>
          {this.renderSourceCodeLink(variable)}
          <hr />
          <ExternalLink
            href={`${config.apiBaseUrl}/api/1/variables?name=${variable.name}`}
            title="Voir la donnée brute au format JSON"
          >
            Export JSON
          </ExternalLink>
        </div>
      </DocumentTitle>
    )
  },
  renderConsumerVariables(variable) {
    const {variables} = this.props
    const consumerVariables = variables.filter(variable2 => isConsumerVariable(variable2, variable.name))
    return [
      <dt key="dt">Formules utilisant cette variable</dt>,
      <dd key="dd">
        {
          consumerVariables && consumerVariables.length ? (
            <List items={sortBy(prop("name"), consumerVariables)} type="inline">
              {variable2 => <Link title={variable2.label} to={`/${variable2.name}`}>{variable2.name}</Link>}
            </List>
          ) : (
              <span className="label label-warning">Aucune</span>
            )
        }
      </dd>,
    ]
  },
  renderDatedFormula(formula) {
    return formula.dated_formulas.map((datedFormula, idx) => (
      <div key={idx}>
        <h4 style={{ display: "inline-block" }}>
          {this.renderDatedFormulaHeading(datedFormula)}
        </h4>
        {this.renderFormula(datedFormula.formula)}
        <hr />
      </div>
    ))
  },
  renderDatedFormulaHeading(formula) {
    if (formula.start_instant && formula.stop_instant) {
      return (
        <span>
          Formule de calcul du
          {" "}
          <FormattedDate value={formula.start_instant} />
          {" "}
          au
          {" "}
          <FormattedDate value={formula.stop_instant} />
        </span>
      )
    }
    if (formula.start_instant) {
      return (
        <span>
          Formule de calcul depuis le
          {" "}
          <FormattedDate value={formula.start_instant} />
        </span>
      )
    }
    if (formula.stop_instant) {
      return (
        <span>
          Formule de calcul jusqu'au
          {" "}
          <FormattedDate value={formula.stop_instant} />
        </span>
      )
    }
  },
  renderFormula(formula) {
    const {parameters} = this.props
    const inputVariableNames = formula.input_variables
    const formulaParameterNames = formula.parameters
    return (
      <div>
        {
          (inputVariableNames || formulaParameterNames) && (
            <dl>
              {inputVariableNames && <dt>Variables utilisées</dt>}
              {
                inputVariableNames && (
                  <dd>
                    <List items={sort(substract, inputVariableNames)} type="inline">
                      {name => <Link to={`/${name}`}>{name}</Link>}
                    </List>
                  </dd>
                )
              }
              {formulaParameterNames && <dt>Paramètres utilisés</dt>}
              {
                formulaParameterNames && (
                  <dd>
                    <List items={sort(substract, formulaParameterNames)} type="inline">
                      {
                        parameterName => {
                          const parameter = parameters[parameterName]
                          if (parameter) {
                            return (
                              <span>
                                <Link title={parameter.description} to={`/${parameterName}`}>
                                  {parameterName}
                                </Link>
                              </span>
                            )
                          } else {
                            return (
                              <span>
                                {parameterName}
                                {" "}
                                <span className="label label-warning">inexistant</span>
                              </span>
                            )
                          }
                        }
                      }
                    </List>
                  </dd>
                )
              }
            </dl>
          )
        }
      </div>
    )
  },
  renderSimpleFormula(formula) {
    return (
      <div>
        <h4 style={{ display: "inline-block" }}>Formule de calcul</h4>
        {this.renderFormula(formula)}
      </div>
    )
  },
  renderDefinitionsLists(variable) {
    // TODO Do not hardcode entities.
    const entityMessageByNamePlural = {
      famille: "de la famille",
      foyer_fiscal: "du foyer fiscal",
      individu: "de l'individu",
      menage: "du ménage",
    }
    const type = variable["@type"]
    return (
      <div>
        <dl>
          <dt>Se calcule à l'échelle</dt>
          <dd>{entityMessageByNamePlural[variable.entity]}</dd>
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
              <dt key="dt">Entre en vigueur à partir du</dt>,
              <dd key="dd">
                <FormattedDate value={variable.start} />
              </dd>,
            ]
          }
          {
            variable.end && [
              <dt key="dt">N'est plus en vigueur à partir du</dt>,
              <dd key="dd">
                <FormattedDate value={variable.end} />
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
        </dl>
        <hr />
        <h4>Données spécifiques à OpenFisca</h4>
        <dl>
          <dt>Nom de la variable</dt>
          <dd>{variable.name}</dd>
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
          <dd>
            <samp>
              {
                type === "Boolean" ?
                  JSON.stringify(variable.default) :
                  variable.default
              }
            </samp>
          </dd>
          {this.renderConsumerVariables(variable)}
        </dl>
      </div>
    )
  },
  renderSourceCodeLink(variable) {
    const {countryPackageName, countryPackageVersion} = this.props
    let sourceCodeText = variable.source_file_path.split('/').slice(-1)
    if (variable.start_line_number) {
      sourceCodeText += ` ligne ${variable.start_line_number}`
    }
    return (
      <GitHubLink
        blobUrlPath={countryPackageName + '/' + variable.source_file_path}
        commitReference={countryPackageVersion}
        lineNumber={variable.start_line_number}
        style={{ marginLeft: "1em" }}
        text={sourceCodeText}
      />
    )
  },
})


export default Variable
