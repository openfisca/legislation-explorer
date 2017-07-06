import DocumentTitle from "react-document-title"
import { FormattedDate } from "react-intl"
import React, { PropTypes } from "react"
import {Link} from "react-router"
import { keys } from "ramda"

import config from "../config"
import * as AppPropTypes from "../app-prop-types"
import ExternalLink from "./external-link"
import getDayBefore from "../periods"
import Highlight from 'react-highlight'

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
            <p className="descriptionForVariables">{variable.description}</p>
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
      famille: "famille",
      foyer_fiscal: "foyer fiscal",
      individu: "individu",
      menage: "ménage",
    }
    const definitionPeriodMessage = {
      YEAR: "d'un an",
      MONTH: "d'un mois",
      ETERNITY: "qui est l'éternité. Sa valeur est fixe dans le temps",
    }
    const valueTypeMessage = {
      Int: "un entier",
      Float: "un nombre décimal",
      Date: "une date",
    }

    return (
      <div>
        <p>
          Cette <a href="https://doc.openfisca.fr/variables.html">variable</a> s'applique aux <a href="https://doc.openfisca.fr/person,_entities,_role.html">entités </a>
          <span className="variableMetadataHighlight">
            {entityMessage[variable.entity]}
          </span>
          .
        </p>
        <p>
          Elle a une <a href="https://doc.openfisca.fr/periodsinstants.html">période de définition </a>
          <span className="variableMetadataHighlight">
            {definitionPeriodMessage[variable.definitionPeriod]}
          </span>
          .
        </p>
        <p>
          Sa valeur est 
          <span className="variableMetadataHighlight">
            {variable.valueType in valueTypeMessage ?(
              <span> {valueTypeMessage[variable.valueType]}.</span>
            ) : (
              <span> {variable.valueType}.</span>
            )}
          </span>
        </p>
        <p>
          Sa <a href="https://doc.openfisca.fr/coding-the-legislation/20_input_variables.html">valeur par défaut est </a> 
          <span className="variableMetadataHighlight">
            {variable.valueType == "Date" ?(
              <span>{<FormattedDate value={variable.defaultValue} year='numeric' month='2-digit' day='2-digit'/>}</span>
            ) : (
              <span>{String(variable.defaultValue)}</span>
            )}
          </span>
          .
        </p> 
          { variable.references && 
            (<span>Références&nbsp;:</span>)
          }

          { variable.references && 
            (<ul>
              {
                variable.references.map((reference, idx) =>
                  <li key={idx}>
                    <ExternalLink href={reference}>
                      {reference}
                    </ExternalLink>
                  </li>
                )}
           </ul>)
          }
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
                <Highlight className='python'>{this.renderLinkedFormulaVariables(formulas[date].content)}</Highlight>
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
    // Ignore every text that isn't a single word like a variable must be:
    return (! substring.includes(" ") && this.props.variables[substring])
  },
  splitAndLink(text, separator) {
    const splits = text.split(separator)
    return splits.map((substring, index) => {
      if (this.isVariable(substring)) {
        substring = [this.link(substring), separator]  // Concatenate JSX with a string (+ doesn't work).
      } else {
        substring = index < splits.length - 1 ? substring + separator : substring
      }
      return substring
    })
  },
  // Change every OpenFisca variable in the formula by a link to the variable page:
  renderLinkedFormulaVariables(formula) {
    // Split on double quotes first (preventing collision with Link):
    const splits = this.splitAndLink(formula, '"')
    return splits.map((substring) => {
      // Only split strings, as trying to split JSX Links would raise an error
      return typeof substring == 'string' ? this.splitAndLink(substring, '\'') : substring
    })
  },
})


export default Variable
