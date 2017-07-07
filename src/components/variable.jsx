import DocumentTitle from "react-document-title"
import {defineMessages, FormattedMessage, FormattedDate} from "react-intl"
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
              <FormattedMessage id='editThisVariable'/>
            </ExternalLink>
          </div>
          {keys(variable.formulas).length != 0 && this.renderFormulas(variable.formulas)}
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
      YEAR: <FormattedMessage id='aYear'/>,
      MONTH: <FormattedMessage id='aMonth'/>,
      ETERNITY: <FormattedMessage id='forEternity'/>
    }
    const valueTypeMessage = {
      Int: <FormattedMessage id='anInteger'/>,
      Float: <FormattedMessage id='aFloat'/>,
      Date: <FormattedMessage id='aDate'/>,
    }
    function formatDefaultValue(variable){
    if (variable.valueType == "Date"){
      return <FormattedDate value={variable.defaultValue} year='numeric' month='2-digit' day='2-digit'/>
    }else if(variable.valueType == "Float"){
      if (String(variable.defaultValue).indexOf('.')!= -1){
        return String("variable.defaultValue").indexOf('.')
      }else{
        return String(variable.defaultValue) + '.0';
      }
    }else{
      return String(variable.defaultValue)
    }
  }
    
    return (
      <div>
        <p>
            <FormattedMessage id='entityParagraph'
              values={{
                variableLink: 
                  <a href="href='https://doc.openfisca.fr/variables.html'">
                    <FormattedMessage id='variableText'/>
                  </a>,
                entityLink:
                  <a href="https://doc.openfisca.fr/periodsinstants.html">
                    <FormattedMessage id='entityText'/>
                  </a>
                }}/>
            <span className="variableMetadataHighlight">
              {entityMessage[variable.entity]}
            </span>
          .
        </p>
        <p>
          <FormattedMessage id='definitionPeriodParagraph' 
            values={{definitionPeriodLink: 
              <a href="https://doc.openfisca.fr/periodsinstants.html">
              <FormattedMessage id='definitionPeriodText'/></a>}}
            />
          <span className="variableMetadataHighlight">
            {definitionPeriodMessage[variable.definitionPeriod]}
          </span>
          .
        </p>
        <p>
          <FormattedMessage id='valueTypeParagraph'/> 
          <span className="variableMetadataHighlight">
            {variable.valueType in valueTypeMessage ?(
              <span> {valueTypeMessage[variable.valueType]}.</span>
            ) : (
              <span> {variable.valueType}.</span>
            )}
          </span>
        </p>
        <p>
          <FormattedMessage id='defaultValueParagraph'
            values={{defaultValueLink:
              <a href="https://doc.openfisca.fr/coding-the-legislation/20_input_variables.html">
              <FormattedMessage id='defaultValueText'/>
              </a>}
            }
          />
          <span className="variableMetadataHighlight">
            {formatDefaultValue(variable)}
          </span>
          .
        </p> 
          { variable.references && 
            (<span><FormattedMessage id='referencesText'/>&nbsp;:</span>)
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
          {keys(variable.formulas).length == 0 &&
            <p>
              <FormattedMessage id='noFormulaParagraph'
                values={{
                  formulaNotComputable:
                  <span className="variableMetadataHighlight">
                    <FormattedMessage id='formulaNotComputableText'/>
                  </span>
                }}
              />
            </p>
          }
    </div>
    )
  },
  renderFormulas(formulas) {
    const startDates = keys(formulas).sort().reverse()
    const severalFormulas = (startDates.length > 2) || (startDates.length == 2) && formulas[startDates[0]]
    return (
      <div>
        <h2>
        {severalFormulas ? (
              <FormattedMessage id='formulasTitle'/>
            ) : (
              <FormattedMessage id='formulaTitle'/>
            )}
        </h2>
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
