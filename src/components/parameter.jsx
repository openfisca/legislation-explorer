import DocumentTitle from "react-document-title"
import {injectIntl, intlShape, FormattedDate, FormattedMessage} from 'react-intl';
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
    const isScale = (! parameter.values)
    //Add word break opportunities before dots for long parameter id
    const multilineId = parameter.id.replace(/\./g, '<wbr>.')

    return (
      <DocumentTitle title={parameter.id + ' — ' + this.props.intl.formatMessage({ id: 'appName' })}>
        <div>
          <header className="page-header">
            <h1><code dangerouslySetInnerHTML={{__html: multilineId}}></code></h1>
            { parameter.description
              ? <p className="description">{parameter.description}</p>
              : <em><FormattedMessage id="noDescription"/></em>
            }

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
            <FormattedMessage id="rawJSONData"/>
          </ExternalLink>
        </div>
      </DocumentTitle>
    )
  },
  renderStartStopValue(parameter, startDate, stopDate, value, index) {
    if (value === null) {
      return (
        <tr key={index}>
          <td colSpan="2">
            <FormattedMessage id="parameterNotInLegislationSince"
              values={{ date: <FormattedDate value={startDate} /> }}
            />
          </td>
        </tr>
      )
    }
    return (
      <tr key={index}>
        <td>
          <FormattedMessage id={stopDate ? 'fromToDate' : 'fromDate'}
            values={{
              startDate: <FormattedDate value={startDate} />,
              stopDate: stopDate && <FormattedDate value={stopDate} />
            }}
          />
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
