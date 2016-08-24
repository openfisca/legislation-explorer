import DocumentTitle from "react-document-title"
import {injectIntl, intlShape, FormattedDate} from 'react-intl';
import {Link} from "react-router"
import React, {PropTypes} from "react"
import {sortBy, prop} from "ramda"

import * as AppPropTypes from "../../app-prop-types"
import BreadCrumb from "../breadcrumb"
import Collapse from "../collapse"
import Dropdown from "../dropdown"
import GitHubLink from "../github-link"
import List from "../list"


function findLastKnownStartInstant(brackets) {
  return brackets.reduce((memo, bracket) => {
    const bracketLastRateStart = bracket.rate[0].start
    const bracketLastThresholdStart = bracket.threshold[0].start
    let bracketLastInstant = bracketLastRateStart > bracketLastThresholdStart
      ? bracketLastRateStart
      : bracketLastThresholdStart
    if (memo && memo > bracketLastInstant) {
      bracketLastInstant = memo
    }
    return bracketLastInstant
  }, null)
}


function getBracketsAtInstant(brackets, instant) {
  const containsInstant = item => item.start <= instant && (!item.stop || item.stop >= instant)
  const bracketsAtInstant = brackets.reduce((memo, bracket) => {
    const rate = bracket.rate.find(containsInstant)
    const threshold = bracket.threshold.find(containsInstant)
    if (rate && threshold) {
      memo.push({rate, threshold})
    }
    return memo
  }, [])
  return bracketsAtInstant.length ? bracketsAtInstant : null
}


function getTodayInstant() {
  return new Date().toJSON().slice(0, "YYYY-MM-DD".length)
}


function isConsumerVariable(variable, name) {
  // Does `variable` consume `name` as a parameter?
  function isConsumerFormula(formula) {
    return formula.parameters && formula.parameters.length && formula.parameters.includes(name)
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
      // Ignore those variable types since they have an implicit formula, not using any parameter of the legislation.
      return false
    default:
      console.error("Unexpected formula type:", formula["@type"])
      return false
  }
}


const ParameterPage = React.createClass({
  propTypes: {
    countryPackageVersion: PropTypes.string.isRequired,
    currency: PropTypes.string.isRequired,
    intl: intlShape.isRequired,
    params: PropTypes.shape({name: PropTypes.string.isRequired}).isRequired, // URL params
    parameters: PropTypes.arrayOf(AppPropTypes.parameterOrScale).isRequired,
    variables: PropTypes.arrayOf(AppPropTypes.variable).isRequired,
  },
  getInitialState() {
    const {intl, parameters, params} = this.props
    const {name} = params
    const parameter = parameters.find(parameter => parameter.name === name)
    if (parameter) {
      const type = parameter["@type"]
      if (type === "Scale") {
        const instant = findLastKnownStartInstant(parameter.brackets)
        return {
          instant,
          instantText: intl.formatDate(instant),
        }
      }
    }
    return {}
  },
  handleInstantApply() {
    const {instantText} = this.state
    const instant = instantText.split("/").reverse().join("-")
    this.setState({instant})
  },
  handleInstantSet(instant) {
    const {intl} = this.props
    this.setState({
      instant,
      instantText: intl.formatDate(instant),
    })
  },
  handleInstantSubmit(event) {
    event.preventDefault()
    this.handleInstantApply()
  },
  handleInstantTextChange(event) {
    this.setState({instantText: event.target.value})
  },
  handleLastKnownInstantClick() {
    const {intl, parameters, params} = this.props
    const {name} = params
    const parameter = parameters.find(parameter => parameter.name === name)
    const {brackets} = parameter
    const instant = findLastKnownStartInstant(brackets)
    this.setState({
      instant,
      instantText: intl.formatDate(instant),
    })
  },
  handleTodayClick() {
    const {intl} = this.props
    const instant = getTodayInstant()
    this.setState({
      instant,
      instantText: intl.formatDate(instant),
    })
  },
  render() {
    const {parameters, params} = this.props
    const {name} = params
    const parameter = parameters.find(parameter => parameter.name === name)
    if (!parameter) {
      const notFoundMessage = "Paramètre non trouvé"
      return (
        <DocumentTitle title={`${notFoundMessage} - Explorateur de la législation`}>
          <div>
            <BreadCrumb>
              <li>
                <Link to="/parameters">Paramètres</Link>
              </li>
              <li className="active">{notFoundMessage}</li>
            </BreadCrumb>
            <div className="page-header">
              <h1>{notFoundMessage}</h1>
            </div>
            <div className="alert alert-danger">
              {`Le paramètre « ${name} » n'existe pas.`}
            </div>
            <Link to="/parameters">Retour à la liste des paramètres</Link>
          </div>
        </DocumentTitle>
      )
    }
    const {description} = parameter
    const descriptionMessage = description || "Aucune description"
    const type = parameter["@type"]
    return (
      <DocumentTitle title={`${descriptionMessage} - Explorateur de la législation`}>
        <div>
          <BreadCrumb>
            <li key="parameters">
              <Link to="/parameters">Paramètres</Link>
            </li>
            <li className="active">{name}</li>
          </BreadCrumb>
          <div className="page-header">
            <h1>{descriptionMessage}</h1>
          </div>
          {this.renderDefinitionsList(parameter)}
          <hr/>
          <div className="row">
            <div className="col-lg-8">
              {
                type === "Parameter"
                  ? this.renderParameter(parameter)
                  : this.renderScale(parameter)
              }
            </div>
          </div>
          {this.renderSourceCodeLink(parameter)}
        </div>
      </DocumentTitle>
    )
  },
  renderBracket(parameter, bracket, idx) {
    const {brackets, format, unit} = parameter
    return (
      <div>
        <dl>
          <dt>{`Seuils tranche ${idx + 1}`}</dt>
          <dd style={{marginBottom: "1em"}}>
            {this.renderStartStopValueTable(parameter, bracket.threshold, format, unit)}
          </dd>
          <dt>{`Taux tranche ${idx + 1}`}</dt>
          <dd>
            {this.renderStartStopValueTable(parameter, bracket.rate, "rate")}
          </dd>
        </dl>
        {idx < brackets.length - 1 && <hr/>}
      </div>
    )
  },
  renderBracketsAtInstant(parameter, bracketsAtInstant) {
    const {countryPackageVersion} = this.props
    const {format, unit, xml_file_path} = parameter
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
              bracketsAtInstant.slice(1).map((bracketAtInstant, idx) => {
                const previousBracketAtInstant = bracketsAtInstant[idx]
                const previousValue = previousBracketAtInstant.threshold.value
                return (
                  <tr key={idx}>
                    <td width="50%">
                      {
                        idx === 0
                          ? (
                            <span>
                              Jusqu'à
                              {" "}
                              {this.renderValue(bracketAtInstant.threshold.value, format, unit)}
                            </span>
                          )
                          : (
                            <span>
                              De
                              {" "}
                              {this.renderValue(idx === 0 ? previousValue : previousValue + 1, format, unit)}
                              {" "}
                              à
                              {" "}
                              {this.renderValue(bracketAtInstant.threshold.value, format, unit)}
                            </span>
                          )
                      }
                      {
                        xml_file_path && (
                          <GitHubLink
                            blobUrlPath={xml_file_path}
                            className="pull-right"
                            commitReference={countryPackageVersion}
                            endLineNumber={bracketAtInstant.threshold.end_line_number}
                            lineNumber={bracketAtInstant.threshold.start_line_number}
                            text={null}
                            title="Voir la valeur sur GitHub"
                          />
                        )
                      }
                    </td>
                    <td>
                      <div className="clearfix">
                        {this.renderValue(bracketAtInstant.rate.value, "rate")}
                        {
                          xml_file_path && (
                            <GitHubLink
                              blobUrlPath={xml_file_path}
                              className="pull-right"
                              commitReference={countryPackageVersion}
                              endLineNumber={bracketAtInstant.rate.end_line_number}
                              lineNumber={bracketAtInstant.rate.start_line_number}
                              text={null}
                              title="Voir la valeur sur GitHub"
                            />
                          )
                        }
                      </div>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    )
  },
  renderConsumerVariables(parameter) {
    const {variables} = this.props
    const consumerVariables = variables.filter(variable => isConsumerVariable(variable, parameter.name))
    return [
      <dt key="dt">Formules utilisant ce paramètre</dt>,
      <dd key="dd">
        {
          consumerVariables && consumerVariables.length
            ? (
              <List items={sortBy(prop("name"), consumerVariables)} type="inline">
                {variable => <Link title={variable.label} to={`/variables/${variable.name}`}>{variable.name}</Link>}
              </List>
            )
            : <span className="label label-warning">Aucune</span>
        }
      </dd>,
    ]
  },
  renderDefinitionsList(parameter) {
    const {currency} = this.props
    const {format, unit} = parameter
    const type = parameter["@type"]
    return (
      <dl>
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
        {this.renderConsumerVariables(parameter)}
      </dl>
    )
  },
  renderFloatValue(value) {
    const decimalPartLength = 3
    let [integerPart, decimalPart] = value.toFixed(decimalPartLength).split(".")
    if (decimalPart === "0".repeat(decimalPartLength)) {
      decimalPart = null
    }
    return (
      <span>
        <span style={{
          display: "inline-block",
          textAlign: "right"
        }}>
          {integerPart}
        </span>
        {decimalPart && "."}
        {decimalPart}
      </span>
    )
  },
  renderParameter(parameter) {
    return (
      <div>
        <h4 style={{marginBottom: "2em"}}>Valeurs</h4>
        {this.renderStartStopValueTable(parameter, parameter.values)}
      </div>
    )
  },
  renderScale(parameter) {
    const {brackets} = parameter
    const {instant, instantText} = this.state
    const bracketsAtInstant = getBracketsAtInstant(brackets, instant)
    const todayInstant = getTodayInstant()
    const todayBracketsAtInstant = getBracketsAtInstant(brackets, todayInstant)
    let dropdownItems = [
      {
        onSelect: this.handleInstantApply,
        text: "OK",
        title: "Afficher un barème à la date demandée",
      },
      {
        onSelect: this.handleLastKnownInstantClick,
        text: "Dernière date connue",
        title: "Afficher un barème correspondant à la dernière date connue toutes tranches confondues",
      },
    ]
    if (todayBracketsAtInstant) {
      dropdownItems.push({
        onSelect: this.handleTodayClick,
        text: "Aujourd'hui",
        title: "Afficher un barème à la date du jour",
      })
    }
    return (
      <div>
        <h4 id="bareme" style={{marginBottom: "2em"}}>
          <form className="form-inline" onSubmit={this.handleInstantSubmit}>
            Barème au
            {" "}
            <div className="input-group input-group-sm">
              <input
                className="form-control"
                onBlur={this.handleInstantApply}
                onChange={this.handleInstantTextChange}
                placeholder="DD/MM/YYYY"
                type="text"
                value={instantText}
              />
              <Dropdown
                className="input-group-btn"
                items={dropdownItems}
              />
            </div>
          </form>
        </h4>
        {
          bracketsAtInstant ?
            this.renderBracketsAtInstant(parameter, bracketsAtInstant) : (
              <div className="alert alert-info" role="alert">
                Aucun barème à afficher, les données ne sont pas définies à cette date.
              </div>
            )
        }
        <hr/>
        <Collapse title={<h4>Historique exhaustif par tranche</h4>}>
          <p>Il est possible de cliquer sur les dates ci-dessous pour afficher le barème à cette date.</p>
          <List items={brackets} type="unstyled">
            {(bracket, idx) => this.renderBracket(parameter, bracket, idx)}
          </List>
        </Collapse>
      </div>
    )
  },
  renderSourceCodeLink(parameter) {
    const {countryPackageVersion} = this.props
    const {xml_file_path, start_line_number, end_line_number} = parameter
    const fileName = xml_file_path ? xml_file_path.split("/").splice(-1) : null
    const sourceCodeLinkLabel = xml_file_path ?
      (
        start_line_number ?
          (
            end_line_number ?
              `${fileName} ligne ${start_line_number} à ${end_line_number}` :
              `${fileName} ligne ${start_line_number}`
          ) :
          `${fileName}`
      ) :
      null
    return (
      sourceCodeLinkLabel
        ? (
          <GitHubLink
            blobUrlPath={xml_file_path}
            commitReference={countryPackageVersion}
            endLineNumber={end_line_number}
            lineNumber={start_line_number}
            text={sourceCodeLinkLabel}
          />
        ) : null
    )
  },
  renderStartStopValue(parameter, itemOfValues, idx) {
    const {countryPackageVersion} = this.props
    const {format, start_line_number, end_line_number, unit, xml_file_path} = parameter
    const type = parameter["@type"]
    const {start, stop, value} = itemOfValues
    const formattedStartDate = <FormattedDate value={start} />
    const startComponent = type === "Scale"
      ? (
        <a
          href="#bareme"
          onClick={() => this.handleInstantSet(start)}
          title="Afficher le barème à cette date"
        >
          {formattedStartDate}
        </a>
      ) : formattedStartDate
    let stopComponent
    if (stop) {
      const formattedStopDate = <FormattedDate value={stop} />
      stopComponent = type === "Scale" ? (
        <a
          href="#bareme"
          onClick={() => this.handleInstantSet(stop)}
          title="Afficher le barème à cette date"
          >
          {formattedStopDate}
        </a>
      ) : formattedStopDate
    }
    return (
      <tr key={idx}>
        <td>
          {
            stop
              ? <span>Du {startComponent} au {stopComponent}</span>
              : <span>À partir du {startComponent}</span>
          }
        </td>
        <td className="clearfix">
          {this.renderValue(value, format, unit)}
          {
            xml_file_path && (
              <GitHubLink
                blobUrlPath={xml_file_path}
                className="pull-right"
                commitReference={countryPackageVersion}
                endLineNumber={end_line_number}
                lineNumber={start_line_number}
                text={null}
                title="Voir la valeur sur GitHub"
              />
            )
          }
        </td>
      </tr>
    )
  },
  renderStartStopValueTable(parameter, items) {
    return (
      <table className="table table-bordered table-hover table-striped">
        <tbody>
          {items.map((itemOfValues, idx) => this.renderStartStopValue(parameter, itemOfValues, idx))}
        </tbody>
      </table>
    )
  },
  renderValue(value, format, unit) {
    const {currency} = this.props
    return (
      <span>
        <samp>
          {
            format === "rate"
              ? this.renderFloatValue(value * 100)
              : format !== "boolean"
                ? this.renderFloatValue(value)
                : value
          }
        </samp>
        {
          (format === "rate" || unit === "currency") && (
            <samp>{" "}{format === "rate" ? "%" : currency}</samp>
          )
        }
      </span>
    )
  },
})


export default injectIntl(ParameterPage)
