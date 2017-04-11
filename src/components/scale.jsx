import classNames from "classnames"
import React from "react"
import {FormattedDate} from 'react-intl';

import * as AppPropTypes from "../app-prop-types"
import Value from "./value"


const Scale = React.createClass({
  propTypes: {
    parameter: AppPropTypes.parameter.isRequired,
  },
  render() {
    const {brackets} = this.props.parameter
    return (
      <table className="table table-bordered table-hover table-striped">
        <tbody>
          {
            Object.keys(brackets).sort().reverse().map((startDate, startDateIndex) => {
              const bracketAtDate = brackets[startDate]
              return Object.keys(bracketAtDate).map((threshold, thresholdIndex) => {
                const value = bracketAtDate[threshold]
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
                    <td>
                      Au-dessus de
                      {" "}
                      <Value>{threshold}</Value>
                    </td>
                    <td>
                      <Value>{value}</Value>
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
