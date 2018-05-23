import classNames from "classnames"
import React from "react"
import { FormattedMessage, FormattedDate, FormattedNumber } from 'react-intl';

import * as AppPropTypes from "../app-prop-types"


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
            <th><FormattedMessage id="date"/></th>
            <th><FormattedMessage id="bracket"/></th>
            <th><FormattedMessage id="marginalRate"/></th>
          </tr>
        </thead>
        <tbody>
          {
            Object.keys(brackets).sort().reverse().map((startDate, bracketIndex) => {
              const bracket = brackets[startDate]
              const thresholds = Object.keys(bracket).sort((a,b) => Number(a) - Number(b))

              return thresholds.map((threshold, thresholdIndex) => {
                const isFirstBracket = thresholdIndex === 0
                const hasNextThreshold = thresholds[thresholdIndex + 1]
                const nextThreshold = hasNextThreshold && Number(hasNextThreshold)  // '0' is truthy while Number('0') is falsy
                const marginalRate = bracket[threshold];
                threshold = parseFloat(threshold)

                return (
                  <tr
                    className={classNames({"first-bracket": isFirstBracket})}
                    key={`${bracketIndex}-${thresholdIndex}`}
                  >
                    {
                      isFirstBracket && (
                        <td rowSpan={Object.keys(bracket).length}>
                          <FormattedMessage id="fromDate"
                            values={{
                              startDate: <FormattedDate value={startDate} year="numeric" month="2-digit" day="2-digit" />
                            }}
                          />
                        </td>
                      )
                    }
                    <td>
                      <FormattedMessage id={hasNextThreshold ? 'betweenValues' : 'overValue'}
                        values={{
                          startValue: <samp><FormattedNumber value={threshold}/></samp>,
                          stopValue: hasNextThreshold && <samp><FormattedNumber value={nextThreshold}/></samp>,
                        }}
                      />
                    </td>
                    <td>
                      <samp><FormattedNumber value={marginalRate} style="percent" maximumFractionDigits={3}/></samp>
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
