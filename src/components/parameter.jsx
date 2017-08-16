import DocumentTitle from "react-document-title"
import {injectIntl, intlShape, FormattedDate} from 'react-intl';
import React, {PropTypes} from "react"

import config from "../config"
import * as AppPropTypes from "../app-prop-types"
import ExternalLink from "./external-link"
import Scale from "./scale"
import getDayBefore from "../periods"

const Parameter = React.createClass({
  propTypes: {
    countryPackageName: PropTypes.string.isRequired,
    countryPackageVersion: PropTypes.string.isRequired,
    intl: intlShape.isRequired,
    parameter: AppPropTypes.parameter.isRequired,
  },
  render() {
    const {parameter} = this.props
    const description = parameter.description || "Aucune description"
    const isScale = (! parameter.values)
    const multilineId = parameter.id.replace(/[.]/g, '\u200b.')
    return (
      <DocumentTitle title={`${parameter.id} - Explorateur de la législation`}>
        <div>
          <header className="page-header">
            <h1><code>{multilineId}</code></h1>
            <p className="description">{description}</p>
          </header>
          <div className="row">
            <div className="col-lg-8">
              {
                isScale
                  ? <Scale parameter={parameter} />
                  : this.renderStartStopValueTable(parameter, parameter.values)
              }
            </div>
          </div>
          <hr/>
          <ExternalLink href={`${config.apiBaseUrl}/parameter/${parameter.id}`}>
            Donnée brute au format JSON
          </ExternalLink>
        </div>
      </DocumentTitle>
    )
  },
  renderStartStopValue(parameter, startDate, stopDate, value, index) {
    const formattedStartDate = <FormattedDate value={startDate} />
    if (value === null) {
      return (
        <tr key={index}>
          <td colSpan="2"><span>Ce paramètre ne figure plus dans la législation depuis le {formattedStartDate}</span></td>
        </tr>
      )
    }
    return (
      <tr key={index}>
        <td>
          {
            stopDate
            ? <span>Du {formattedStartDate} au <FormattedDate value={stopDate} /></span>
            : <span>À partir du {formattedStartDate}</span>
          }
        </td>
        <td>
          <samp>{value}</samp>
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
  }
})


export default injectIntl(Parameter)
