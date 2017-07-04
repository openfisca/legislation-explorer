import DocumentTitle from "react-document-title"
import { FormattedDate } from "react-intl"
import React, { PropTypes } from "react"
import {routerShape, locationShape, Link} from "react-router"
import { keys } from "ramda"

import config from "../config"
import * as AppPropTypes from "../app-prop-types"
import ExternalLink from "./external-link"
import getDayBefore from "../periods"


const Variable = React.createClass({
  propTypes: {
    countryPackageName: PropTypes.string.isRequired,
    countryPackageVersion: PropTypes.string.isRequired,
    parameters: PropTypes.objectOf(AppPropTypes.parameter).isRequired,
    variable: AppPropTypes.variable.isRequired,
    variables: PropTypes.objectOf(AppPropTypes.variable).isRequired,
  },
  getTodayInstant() {
    return new Date().toJSON().slice(0, 10)
  },
  render() {
    const {variable} = this.props
    return (
      <DocumentTitle title={`${variable.id} - Explorateur de la législation`}>
        <div>
          <header className="page-header">
            <h1><code>{variable.id}</code></h1>
            <p>{variable.description}</p>
          </header>
          {this.renderVariableMetadata(variable)}
          <div>
            <ExternalLink href={variable.source}>
              Code source de cette variable
            </ExternalLink>
          </div>
          {variable.formulas && this.renderFormulas(variable.formulas)}
          <div>
            <ExternalLink href={`${config.apiBaseUrl}/variable/${variable.id}`}>
              Donnée brute au format JSON
            </ExternalLink>
          </div>
        </div>
      </DocumentTitle>
    )
  },
  renderVariableMetadata(variable) {
    const entityMessage = {
      famille: "une famille",
      foyer_fiscal: "un foyer fiscal",
      individu: "un individu",
      menage: "un ménage",
    }
    const definitionPeriodMessage = {
      YEAR: "de l'année",
      MONTH: "du mois",
      ETERNITY: "de l'éternité (cette variable ne peut pas évoluer avec le temps)",
    }
    return (
      <div>
        <dl>
          <dt>Cette variable est définie pour</dt>
          <dd>{entityMessage[variable.entity]}.</dd>
          <dt>Elle se calcule à l'échelle</dt>
          <dd>{definitionPeriodMessage[variable.definitionPeriod]}.</dd>
          <dt>Elle est de type</dt>
          <dd>{variable.valueType}.</dd>
          <dt>Sa valeur par défault est</dt>
          <dd>{String(variable.defaultValue)}.</dd>
          { variable.references && <dt>Références&nbsp;:</dt> }
          { variable.references && (
            <dd><ul>
              {
                variable.references.map((reference, idx) =>
                  <li key={idx}>
                    <ExternalLink href={reference}>
                      {reference}
                    </ExternalLink>
                  </li>
                )
              }
            </ul></dd>
          )}
        </dl>
      </div>
    )
  },
  renderFormulas(formulas) {
    const startDates = keys(formulas).sort().reverse()
    const severalFormulas = (startDates.length > 2) || (startDates.length == 2) && formulas[startDates[0]]
    return (
      <div>
        <h2>Formule{severalFormulas && 's'} de calcul</h2>
        {startDates.map(
          (date, dateIndex) => {
            const startDate = (date != '0001-01-01') && date
            const stopDate = startDates[dateIndex - 1] && getDayBefore(startDates[dateIndex - 1])
            return formulas[date] && (
              <div key={date}>
                {startDate && (! stopDate) &&
                  <h3>À partir du <FormattedDate value={startDate} />&nbsp;:</h3>
                }
                {stopDate && (! startDate) &&
                  <h3>Jusqu'au <FormattedDate value={stopDate} />&nbsp;:</h3>
                }
                {startDate && stopDate &&
                  <h3>Du <FormattedDate value={startDate} /> au <FormattedDate value={stopDate} />&nbsp;:</h3>
                }
                <pre><code>{this.renderLinkedFormulaVariables(formulas[date].content)}</code></pre>
              </div>
            )
          })
        }
      </div>
    )
  },
  link(variable) {
    return <Link key={variable + Math.random()} to={variable} 
      data-toggle="popover" title={this.props.variables[variable].description}>{variable}</Link> 
  },
  isVariable(substring) {
    //Ignore every text that isn't a single word like a variable must be:
    return (!substring.includes(" ") && this.props.variables[substring])
  },
  linkCodeSplits(splits, separator) {
    var previousIsLink = false
    return splits.map((substring, index) => {
      if (this.isVariable(substring)) {
        substring = this.link(substring)
        previousIsLink = true
      } else {
        substring = previousIsLink ? separator + substring : substring  //No jsx and separator concatenation.
        substring = index < splits.length - 1 ? substring + separator : substring
        previousIsLink = false
      }
      return substring
    })
  },
  //Change every OpenFisca variable in the formula by a link to the variable page:
  renderLinkedFormulaVariables(formula) {
    //Split on double quotes first (preventing collision with Link):
    var splits = this.linkCodeSplits(formula.split('"'), '"') 
    for (var s of splits) {
      s = this.linkCodeSplits(s.split("'"), "'")
    }
    return s
  },
})


export default Variable
