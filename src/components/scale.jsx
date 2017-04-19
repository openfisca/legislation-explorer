import classNames from "classnames"
import React from "react"
import {FormattedDate} from 'react-intl';

import * as AppPropTypes from "../app-prop-types"


function formatRate(value) {
  const formattedValue = (value * 100).toFixed(2).replace(/\.00$/, '')
  return `${formattedValue} %`
}

const Scale = React.createClass({
  propTypes: {
    parameter: AppPropTypes.parameter.isRequired,
  },
  render() {
    const {brackets} = this.props.parameter
    return (
      <table className="table table-bordered table-hover table-striped">
        <thead>
          <tr>
            <th>Date</th>
            <th>Tranche</th>
            <th>Taux marginal</th>
          </tr>
        </thead>
        <tbody>
          {
            Object.keys(brackets).sort().reverse().map((startDate, startDateIndex) => {
              const bracketAtDate = brackets[startDate]
              const thresholds = Object.keys(bracketAtDate)
              return thresholds.map((thresholdKey, thresholdIndex) => {
                const threshold = parseFloat(thresholdKey)
                const value = bracketAtDate[thresholdKey]
                return (
                  <tr
                    className={classNames({"first-bracket": thresholdIndex === 0})}
                    key={`${startDateIndex}-${thresholdIndex}`}
                  >
                    {
                      thresholdIndex === 0 && (
                        <td rowSpan={Object.keys(bracketAtDate).length}>
                          À partir du
                          {" "}
                          <FormattedDate value={startDate} />
                        </td>
                      )
                    }
                    {
                      thresholdIndex < thresholds.length - 1
                        ? (
                          <td>
                            Entre
                            {" "}
                            <samp>{threshold}</samp>
                            {" "}
                            et
                            {" "}
                            <samp>{parseFloat(thresholds[thresholdIndex + 1])}</samp>
                          </td>
                        ) : (
                          <td>
                            Plus de
                            {" "}
                            <samp>{threshold}</samp>
                          </td>
                        )
                    }
                    <td>
                      <samp>{formatRate(value)}</samp>
                    </td>
                  </tr>
                )
              })
            })
          }
        </tbody>
      </table>
    )
  }
})


export default Scale
