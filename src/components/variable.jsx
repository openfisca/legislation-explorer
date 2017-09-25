import DocumentTitle from "react-document-title"
import { FormattedMessage, FormattedDate, FormattedHTMLMessage } from "react-intl"
import React, { PropTypes } from "react"
import { Link } from "react-router"
import { keys, flatten, pipe, map, is } from "ramda"

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
    const { variable } = this.props
    return (
      <DocumentTitle title={ `${ variable.id } - Explorateur de la législation` } >
        <div>
          <header className="page-header">
            <h1><code>{ variable.id }</code></h1>
            <p className="description">{variable.description}</p>
          </header>
          {this.renderVariableMetadata(variable)}
          <div>
            <ExternalLink href={ variable.source } target="_blank">
              <FormattedMessage id="editThisVariable"/>
            </ExternalLink>
          </div>
          { keys(variable.formulas).length != 0 && this.renderFormulas(variable.formulas) }
          <div>
            <ExternalLink href={ `${ config.apiBaseUrl }/variable/${ variable.id }` } target="_blank" >
              <FormattedMessage id="thisVariableJson"/>
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
      YEAR: <FormattedMessage id="aYear"/>,
      MONTH: <FormattedMessage id="aMonth"/>,
      ETERNITY: <FormattedMessage id="forEternity"/>
    }
    const valueTypeMessage = {
      Int: <FormattedMessage id="anInteger"/>,
      Float: <FormattedMessage id="aFloat"/>,
      Date: <FormattedMessage id="aDate"/>,
      String: <FormattedMessage id="aString"/>,
    }
    function formatDefaultValue(variable) {
    if (variable.valueType == "Date") {
      return <FormattedDate
                value={ variable.defaultValue }
                year="numeric"
                month="2-digit"
                day="2-digit"
              />
    } else if (variable.valueType == "Float") {
        return variable.defaultValue.toFixed(1);
    } else if (variable.valueType == "String") {
        return `"${ variable.defaultValue }"`;
    } else {
      return String(variable.defaultValue)
    }
  }
    return (
      <div>
        <p>
            <FormattedMessage
              id="entityParagraph"
              values={{
                variableLink:
                  <a href="http://openfisca.org/doc/variables.html" target="_blank">
                    <FormattedMessage id="variableText"/>
                  </a>,
                entityLink:
                  <a href="http://openfisca.org/doc/person,_entities,_role.html" target="_blank">
                    <FormattedMessage id="entityText"/>
                  </a>
                }} />&nbsp;
            <span className="variable-metadata">
              { entityMessage[variable.entity] }
            </span>
          .
        </p>
        <p>
          <FormattedMessage
            id="definitionPeriodParagraph"
            values={{definitionPeriodLink:
                <a href="http://openfisca.org/doc/coding-the-legislation/35_periods.html#periods-for-variable" target="_blank">
                  <FormattedMessage id="definitionPeriodText"/>
                </a>
            }}
          />&nbsp;
          <span className="variable-metadata">
            { definitionPeriodMessage[variable.definitionPeriod] }
          </span>
          .
        </p>
        <p>
          <FormattedMessage id="valueTypeParagraph"/>
          <span className="variable-metadata"> {
            variable.valueType in valueTypeMessage ? (
              <span>{ valueTypeMessage[variable.valueType] }.</span>
            ) : (
              <span><FormattedMessage id="ofType" values={{type: variable.valueType}}/>.</span>
            )
          }
          </span>
        </p>
        { variable.possibleValues
          ? <p>
            <FormattedHTMLMessage id="authorizedValues"/>
              <ul>
              { variable.possibleValues.map(value => <li>"{value}"</li>)}
              </ul>
            </p>
          : null
        }
        <p>
          <FormattedMessage id="defaultValueParagraph"
            values={{ defaultValueLink:
              <a href="http://openfisca.org/doc/variables.html#default-values" target="_blank">
              <FormattedMessage id="defaultValueText"/>
              </a> }
            }
          />&nbsp;
          <span className="variable-metadata">
            {formatDefaultValue(variable)}
          </span>
          .
        </p>
          { variable.references &&
            (<span><FormattedHTMLMessage id="referencesText"/></span>)
          }
          { variable.references &&
            (<ul>
              {
                variable.references.map((reference, idx) =>
                  <li key={ idx } >
                    <a href={ reference } target="_blank" > { reference } </a>
                  </li>
                )}
           </ul>)
          }
          {keys(variable.formulas).length == 0 &&
            <p>
              <FormattedMessage id="noFormulaParagraph"
                values={{
                  formulaNotComputable:
                  <span className="variable-metadata">
                    <FormattedMessage id="formulaNotComputableText"/>
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
              <FormattedMessage id="formulasTitle"/>
            ) : (
              <FormattedMessage id="formulaTitle"/>
            )}
        </h2>
        { startDates.map(
          (date, dateIndex) => {
            const startDate = (date != "0001-01-01") && date
            const stopDate = startDates[dateIndex - 1] && getDayBefore(startDates[dateIndex - 1])
            return formulas[date] && (
              <div key={ date } >
                {startDate && (! stopDate) &&
                  <h3>À partir du <FormattedDate value={ startDate } />&nbsp;:</h3>
                }
                {stopDate && (! startDate) &&
                  <h3>Jusqu'au <FormattedDate value={ stopDate } />&nbsp;:</h3>
                }
                {startDate && stopDate &&
                  <h3>Du <FormattedDate value={ startDate } /> au <FormattedDate value={ stopDate } />&nbsp;:</h3>
                }
                <Highlight className="python"> { this.renderLinkedFormula(formulas[date].content) } </Highlight>
              <p>
                 <a href={ formulas[date].source }  target="_blank"><FormattedMessage id="editThisFormula"/></a>
              </p>
              </div>
            )
          })
        }
      </div>
    )
  },
  link(variable) {
    return <Link key={ variable + Math.random() } to={ variable }
      data-toggle="popover" title={ this.props.variables[variable].description }>{ variable }</Link>
  },
  linkParam(parameter, linkText) {
    return <Link key={parameter + Math.random()} to={parameter}
      data-toggle="popover" title={this.props.parameters[parameter].description}>{ linkText }</Link>
  },
  isVariable(substring) {
    // Ignore every text that isn't a single word like a variable must be:
    return (! substring.includes(" ") && this.props.variables[substring])
  },

  splitAndLinkVariables(text, separator) {
    // Only split strings, as trying to split JSX Links would raise an error
    if (! is(String, text)) {
      return text
    }
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

  splitAndLinkParams(text) {
    const paramVariable = []
    const recordNodeVariable = (nodeVariableName, path) => {
      const regleParamAbstrait = new RegExp(`((?:[\\S]*[\\s]*[=][\\s]*)?${nodeVariableName}\\.[0-9a-zA-Z\\_\\.]*)`)
      const regleParamAbstraitMatch = new RegExp(`(?:([\\S]*)([\\s]*[=][\\s]*))?(${nodeVariableName}\\.)([0-9a-zA-Z\\_\\.]*)`)
      paramVariable.push({
        'nodeVariableName': nodeVariableName,
        'parameterPath': path,
        'regexSplit': regleParamAbstrait,
        'regexMatch': regleParamAbstraitMatch
      })
    }
    const splits = text.split(/([\S]*[\s]*[=][\s]* parameters\([\S]*\)\.?[\S]*)/)
    // The first pass will go through each substring and find parameters(x=parameter(x).x.x) and check if they are a node or an actual parameter.
    // If it's a node, it records the node and the variable associated. Else, it returns the link.
    return splits.map((substring, index) => {
      //this checks if the split actually happened
      if (index % 2 == 1) {
        const parameterCall = substring.match(/([\S]*)([\s]*[=][\s]*parameters\([\S]*\)\.?)([\S]*)/)
        const parameterPath = parameterCall[3]
        const nodeVariableName = parameterCall[1]
          if (this.props.parameters[parameterPath]) {
            substring = [nodeVariableName, parameterCall[2], this.linkParam(parameterPath, parameterPath)]  // Concatenate JSX with a string (+ doesn't work).
          } else {
            recordNodeVariable(nodeVariableName,parameterPath)
            substring = [substring]
          }
      } else {
        substring = [substring]
        for (let i = 0; i < paramVariable.length; i++) {
          const element = paramVariable[i]
          substring = substring.map(substring2 => {
            return ! is(String, substring2)
              ? substring2
              : substring2
                .split(element.regexSplit)
                .map(substring3 => {
                  const match = substring3.match(element.regexMatch)
                  if (match) {
                    const parameterPath = match[4]
                    const nodePath = element.parameterPath ? `${element.parameterPath}.${parameterPath}` : parameterPath
                    if (this.props.parameters[nodePath]) {
                      const linkThisParam = this.linkParam(nodePath, parameterPath)
                      substring3 = [match[1],match[2],match[3], linkThisParam]
                    } else {
                      const nodeVariableName = match[1]
                      recordNodeVariable(nodeVariableName,nodePath)
                      substring3 = [substring3]
                    }
                  }
                  return substring3
                })
          })
          substring = flatten(substring)
        }
      }
      return substring
    })
  },
  // Change every OpenFisca parameter and variable in the formula by a link to the variable page:
  renderLinkedFormula(formula) {
    // Split on double quotes first (preventing collision with Link):
    return pipe(
      this.splitAndLinkParams,
      flatten,
      map((substring) => {
        return this.splitAndLinkVariables(substring, `"`)
      }),
      flatten,
      map((substring) => {
        return this.splitAndLinkVariables(substring, `'`)
      }),
      flatten,
      )(formula)
  },
})

export default Variable
