import DocumentTitle from "react-document-title"
import {injectIntl, intlShape, FormattedDate} from 'react-intl';
import React, {PropTypes} from "react"

import config from "../config"
import * as AppPropTypes from "../app-prop-types"
import Collapse from "./collapse"
import Dropdown from "./dropdown"
import ExternalLink from "./external-link"
import GitHubLink from "./github-link"
import List from "./list"


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
  return new Date().toISOString().slice(0, "YYYY-MM-DD".length)
}


function getDayBefore(day) {
  const ONE_DAY = 86400000 // in ms
  return new Date(Date.parse(day) - ONE_DAY).toISOString().slice(0, "YYYY-MM-DD".length)
}


const Parameter = React.createClass({
  propTypes: {
    countryPackageName: PropTypes.string.isRequired,
    countryPackageVersion: PropTypes.string.isRequired,
    currency: PropTypes.string.isRequired,
    intl: intlShape.isRequired,
    parameter: AppPropTypes.parameterOrScale.isRequired,
    parameters: PropTypes.objectOf(AppPropTypes.parameterOrScale).isRequired,
    variables: PropTypes.arrayOf(AppPropTypes.variable).isRequired,
  },
  getInitialState() {
    const {intl, parameter} = this.props
    const type = parameter["@type"]
    if (type === "Scale") {
      const instant = findLastKnownStartInstant(parameter.brackets)
      return {
        instant,
        instantText: intl.formatDate(instant),
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
    const {intl, parameter} = this.props
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
    const {parameter} = this.props
    const {brackets, description} = parameter
    const descriptionMessage = description || "Aucune description"
    const type = parameter["@type"]
    return (
      <DocumentTitle title={`${descriptionMessage} - Explorateur de la législation`}>
        <div>
          <div className="page-header">
            <h1>{descriptionMessage}</h1>
          </div>
          <div className="row">
            <div className="col-lg-8">
              {
                type === "Scale"
                  ? this.renderScale(parameter)
                  : this.renderStartStopValueTable(parameter, parameter.values)
              }
            </div>
          </div>
          {this.renderSourceCodeLink(parameter)}
          {
            type === "Scale" && (
              <div>
                <hr/>
                <Collapse title={<h4>Historique exhaustif par tranche</h4>}>
                  <p>Il est possible de cliquer sur les dates ci-dessous pour afficher le barème à cette date.</p>
                  <List items={brackets} type="unstyled">
                    {(bracket, idx) => this.renderBracket(parameter, bracket, idx)}
                  </List>
                </Collapse>
              </div>
            )
          }
          <hr/>
          <ExternalLink
            href={`${config.parameterApiBaseUrl}/parameter/${parameter.id}`}
            title="Voir la donnée brute au format JSON"
          >
            Export JSON
          </ExternalLink>
        </div>
      </DocumentTitle>
    )
  },
  renderBracket(parameter, bracket, idx) {
    const {brackets} = parameter
    return (
      <div>
        <dl>
          <dt>{`Seuils tranche ${idx + 1}`}</dt>
          <dd style={{marginBottom: "1em"}}>
            {this.renderStartStopValueTable(parameter, bracket.threshold)}
          </dd>
          <dt>{`Taux tranche ${idx + 1}`}</dt>
          <dd>
            {this.renderStartStopValueTable(parameter, bracket.rate)}
          </dd>
        </dl>
        {idx < brackets.length - 1 && <hr/>}
      </div>
    )
  },
  renderBracketsAtInstant(parameter, bracketsAtInstant) {
    const {countryPackageName, countryPackageVersion} = this.props
    const {format, unit} = parameter
    const displayableBracketsAtInstant = bracketsAtInstant.map((bracketAtInstant, idx) => {
      if (idx < bracketsAtInstant.length - 1) {
        const nextThreshold = bracketsAtInstant[idx + 1].threshold
        return {...bracketAtInstant, nextThreshold}
      } else {
        return bracketAtInstant
      }
    })
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
              displayableBracketsAtInstant.map((bracketAtInstant, idx) => {
                const value = bracketAtInstant.threshold.value
                const nextValue = bracketAtInstant.nextThreshold ? bracketAtInstant.nextThreshold.value : null
                return (
                  <tr key={idx}>
                    <td width="50%">
                      {
                        nextValue === null
                          ? (
                            <span>
                              À partir de
                              {" "}
                              {this.renderValue(value + 1, format, unit)}
                            </span>
                          )
                          : idx === 0
                              ? (
                                <span>
                                  Jusqu'à
                                  {" "}
                                  {this.renderValue(nextValue, format, unit)}
                                </span>
                              )
                              : (
                                <span>
                                  De
                                  {" "}
                                  {this.renderValue(value + 1, format, unit)}
                                  {" "}
                                  à
                                  {" "}
                                  {this.renderValue(nextValue, format, unit)}
                                </span>
                              )
                      }
                      {
                        parameter.xml_file_path && (
                          <GitHubLink
                            blobUrlPath={countryPackageName + '/' + parameter.xml_file_path}
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
                          parameter.xml_file_path && (
                            <GitHubLink
                              blobUrlPath={countryPackageName + '/' + parameter.xml_file_path}
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
  renderFloatValue(value) {
    const decimalPartLength = 2
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
      </div>
    )
  },
  renderSourceCodeLink(parameter) {
    if (!parameter.xml_file_path) {
      return null
    }
    const {countryPackageName, countryPackageVersion} = this.props
    const {start_line_number, end_line_number} = parameter
    const xml_file_path = countryPackageName + '/' + parameter.xml_file_path
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
  renderStartStopValue(parameter, startDate, stopDate, value, index) {
    const type = parameter["@type"]
    const formattedStartDate = <FormattedDate value={startDate} />
    const startComponent = type === "Scale"
      ? (
        <a
          href="#bareme"
          onClick={() => this.handleInstantSet(startDate)}
          title="Afficher le barème à cette date"
        >
          {formattedStartDate}
        </a>
      ) : formattedStartDate
    let stopComponent
    if (stopDate) {
      const formattedStopDate = <FormattedDate value={stopDate} />
      stopComponent = type === "Scale" ? (
        <a
          href="#bareme"
          onClick={() => this.handleInstantSet(stopDate)}
          title="Afficher le barème à cette date"
          >
          {formattedStopDate}
        </a>
      ) : formattedStopDate
    }
    if (! value) {
      return (
        <tr key={index}>
          <td colSpan="2"><span>Ce paramètre ne figure plus dans la législation depuis le {startComponent}</span></td>
        </tr>
      )
    }
    return (
      <tr key={index}>
        <td>
          {
            stopDate
            ? <span>Du {startComponent} au {stopComponent}</span>
            : <span>À partir du {startComponent}</span>
          }
        </td>
        <td className="clearfix">
          {this.renderValue(value)}
        </td>
      </tr>
    )
  },

  renderStartStopValueTable(parameter, values) {
    return (
      <table className="table table-bordered table-hover table-striped">
        <tbody>
          {Object.keys(values).sort().reverse().map(
            (startDate, index, sortedStartDates) => {
              const nextStartDate = sortedStartDates[index - 1]
              const stopDate = nextStartDate && getDayBefore(nextStartDate)
              return this.renderStartStopValue(parameter, startDate, stopDate, values[startDate], index)
            }
          )}
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


export default injectIntl(Parameter)
