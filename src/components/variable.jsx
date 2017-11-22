import DocumentTitle from "react-document-title"
import { FormattedMessage, FormattedDate, FormattedHTMLMessage } from "react-intl"
import React, { PropTypes } from "react"
import { keys } from "ramda"

import config from "../config"
import * as AppPropTypes from "../app-prop-types"
import ExternalLink from "./external-link"
import Formula from "./formula"
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
        { variable.possibleValues
          ? <div>
            <FormattedHTMLMessage id="authorizedValues"/>
              <table className="table table-bordered table-hover table-striped in-metadata">
                <thead>
                  <tr>
                    <th><FormattedHTMLMessage id="keyword"/></th>
                    <th><FormattedHTMLMessage id="definition"/></th>
                  </tr>
                </thead>
                <tbody>
                  {
                  Object.keys(variable.possibleValues).map((keyword) => {
                    return (
                      <tr>
                        <td className="list-entry">
                          <samp>{keyword}</samp>
                        </td>
                        <td>
                          <samp>{variable.possibleValues[keyword]}</samp>
                        </td>
                      </tr>
                        )
                      })
                  }
                </tbody>
                </table>
            </div>
          : null
        }
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
              <Formula
                key={startDate}
                startDate={startDate}
                stopDate={stopDate}
                content={formulas[date].content}
                source={formulas[date].source}
                variables={this.props.variables}
                parameters={this.props.parameters}
                />
            )
          })
        }
      </div>
    )
  },
})

export default Variable
