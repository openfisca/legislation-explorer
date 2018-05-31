import DocumentTitle from "react-document-title"
import { FormattedMessage, FormattedDate, FormattedNumber, injectIntl, intlShape } from "react-intl"
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
    intl: intlShape.isRequired,
    parameters: PropTypes.objectOf(AppPropTypes.parameter).isRequired,
    variable: AppPropTypes.variable.isRequired,
    variables: PropTypes.objectOf(AppPropTypes.variable).isRequired,
  },

  render() {
    const { variable } = this.props
    return (
      <DocumentTitle title={variable.id + ' — ' + this.props.intl.formatMessage({ id: 'appName' })}>
        <section>
          <h1><code>{ variable.id }</code></h1>
          { variable.description
            ? <p className="description">{variable.description}</p>
            : <em><FormattedMessage id="noDescription"/></em>
          }
          {this.renderVariableMetadata(variable)}
          <ExternalLink href={ variable.source } target="_blank">
            <FormattedMessage id="editThisVariable"/>
          </ExternalLink>
          { keys(variable.formulas).length != 0 && this.renderFormulas(variable.formulas) }
          <ExternalLink href={ `${ config.apiBaseUrl }/variable/${ variable.id }` } target="_blank" >
            <FormattedMessage id="rawJSONData"/>
          </ExternalLink>
        </section>
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
      switch (variable.valueType) {
      case "Date":
        return <FormattedDate value={ variable.defaultValue } year="numeric" month="2-digit" day="2-digit" />
      case "Float":
        return <FormattedNumber value={variable.defaultValue} />
      case "String":
        return `"${ variable.defaultValue }"`
      default:
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
                <a href="https://openfisca.org/doc/variables.html" target="_blank">
                  <FormattedMessage id="variableText"/>
                </a>,
              entityLink:
                <a href="https://openfisca.org/doc/person,_entities,_role.html" target="_blank">
                  <FormattedMessage id="entityText"/>
                </a>
            }} />&nbsp;
          <span className="variable-metadata">
            { entityMessage[variable.entity] }
          </span>.
        </p>
        <p>
          <FormattedMessage
            id="definitionPeriodParagraph"
            values={{definitionPeriodLink:
                <a href="https://openfisca.org/doc/coding-the-legislation/35_periods.html#periods-for-variable" target="_blank">
                  <FormattedMessage id="definitionPeriodText"/>
                </a>
            }}
          />&nbsp;
          <span className="variable-metadata">
            { definitionPeriodMessage[variable.definitionPeriod] }
          </span>.
        </p>
        <p>
          <FormattedMessage id="valueTypeParagraph"/>
          <span className="variable-metadata"> {
            variable.valueType in valueTypeMessage ? (
              valueTypeMessage[variable.valueType]
            ) : (
              <FormattedMessage id="ofType" values={{type: variable.valueType}}/>
            )
          }
          </span>.
        </p>
        <p>
          <FormattedMessage id="defaultValueParagraph"
            values={{ defaultValueLink:
              <a href="https://openfisca.org/doc/variables.html#default-values" target="_blank">
                <FormattedMessage id="defaultValueText"/>
              </a>
            }}
          />&nbsp;
          <samp>{formatDefaultValue(variable)}</samp>.
        </p>
        {
          variable.possibleValues &&
          (<div>
            <FormattedMessage id="allowedValues"/>
            <table className="table table-bordered table-hover table-striped in-metadata">
              <thead>
                <tr>
                  <th><FormattedMessage id="keyword"/></th>
                  <th><FormattedMessage id="definition"/></th>
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
          </div>)
        }
        { variable.references &&
          (<span><FormattedMessage id="referencesText"/></span>)
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
          <FormattedMessage id={ severalFormulas ? 'formulasTitle' : 'formulaTitle'}/>
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

export default injectIntl(Variable)
