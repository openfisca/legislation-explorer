import React from 'react'
import PropTypes from 'prop-types'
import { parameterShape, variableShape } from '../openfisca-proptypes'
import { Link } from 'react-router'
import { FormattedMessage, FormattedDate } from 'react-intl'
import { flatten, pipe, map, is } from 'ramda'
import Highlight from 'react-highlight/lib/optimized'

class Formula extends React.Component {

  static propTypes = {
    startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([false])]), // a string or false
    stopDate: PropTypes.string,
    content: PropTypes.string.isRequired,
    source: PropTypes.string.isRequired,
    parameters: PropTypes.objectOf(parameterShape).isRequired,
    variables: PropTypes.objectOf(variableShape).isRequired,
  };

  render() {
    const { startDate, stopDate, content, source } = this.props

    return (
      <div>
        {startDate &&
          <h3>
            <FormattedMessage id={stopDate ? 'fromToDate' : 'fromDate'}
              values={{
                startDate: startDate && <FormattedDate value={startDate} year="numeric" month="2-digit" day="2-digit" />,
                stopDate: stopDate && <FormattedDate value={stopDate} year="numeric" month="2-digit" day="2-digit" />,
              }}
            />
          </h3>
        }
        <Highlight languages={['python']} className="python">{this.renderLinkedFormula(content)}</Highlight>
        <p>
          <a href={source} rel="noopener" target="_blank"><FormattedMessage id="editThisFormula"/></a>
        </p>
      </div>
    )
  }

  link = (variable) => {
    return <Link key={ variable + Math.random() } to={ variable }
      data-toggle="popover" title={ this.props.variables[variable].description }>{ variable }</Link>
  };

  linkParam = (parameter, linkText) => {
    return <Link key={parameter + Math.random()} to={parameter}
      data-toggle="popover" title={this.props.parameters[parameter].description}>{ linkText }</Link>
  };

  isVariable = (substring) => {
    // Ignore every text that isn't a single word like a variable must be:
    return (! substring.includes(' ') && this.props.variables[substring])
  };

  splitAndLinkVariables = (text, separator) => {
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
  };

  splitAndLinkParams = (text) => {
    const recordedParamNodes = []
    const recordParamNode = (nodeVariableName, path) => {
      // Matches "P_2 = P.af" or "P.af"
      const splitRegex = new RegExp(`((?:[\\S]*[\\s]*[=][\\s]*)?${nodeVariableName}\\.[0-9a-zA-Z\\_\\.]*)`)
      const matchRegex = new RegExp(`(?:([\\S]*)([\\s]*[=][\\s]*))?(${nodeVariableName}\\.)([0-9a-zA-Z\\_\\.]*)`)
      recordedParamNodes.push({
        'nodeVariableName': nodeVariableName,
        'parameterPath': path,
        'splitRegex': splitRegex,
        'matchRegex': matchRegex
      })
    }
    // Matches "P = parameters(period).af"
    const splits = text.split(/([\S]*[\s]*[=][\s]* parameters\([\S]*\)\.?[\S]*)/)
    // We go through each substring and find parameters(x=parameter(x).x.x) and check if they are a node or an actual parameter.
    // If it's a node, it records the node and the variable associated. Else, it returns the link.
    return splits.map((substring, index) => {
      // This checks if the split actually happened
      if (index % 2 == 1) {
        const parameterCall = substring.match(/([\S]*)([\s]*[=][\s]*parameters\([\S]*\)\.?)([\S]*)/)
        const parameterPath = parameterCall[3]
        const nodeVariableName = parameterCall[1]
        if (this.props.parameters[parameterPath]) {
          return [nodeVariableName, parameterCall[2], this.linkParam(parameterPath, parameterPath)]  // Concatenate JSX with a string (+ doesn't work).
        } else {
          recordParamNode(nodeVariableName,parameterPath)
          return [substring]
        }
      } else {
        let substrings = [substring]
        for (let i = 0; i < recordedParamNodes.length; i++) {
          const element = recordedParamNodes[i]
          substrings = substrings.map(substring2 => {
            return ! is(String, substring2)
              ? substring2
              : substring2
                .split(element.splitRegex)
                .map(substring3 => {
                  const match = substring3.match(element.matchRegex)
                  if ( ! match) {
                    return substring3
                  } else {
                    const parameterPath = match[4]
                    const nodePath = element.parameterPath ? `${element.parameterPath}.${parameterPath}` : parameterPath
                    if (this.props.parameters[nodePath]) {
                      const linkThisParam = this.linkParam(nodePath, parameterPath)
                      return [match[1],match[2],match[3], linkThisParam]
                    } else {
                      const nodeVariableName = match[1]
                      recordParamNode(nodeVariableName,nodePath)
                      return [substring3]
                    }
                  }
                })
          })
          substrings = flatten(substrings)
        }
        return substrings
      }
    })
  };

  // Change every OpenFisca parameter and variable in the formula by a link to the variable page:
  renderLinkedFormula = (formula) => {
    // Split on double quotes first (preventing collision with Link):
    return pipe(
      this.splitAndLinkParams,
      flatten,
      map((substring) => {
        return this.splitAndLinkVariables(substring, '"')
      }),
      flatten,
      map((substring) => {
        return this.splitAndLinkVariables(substring, "'")
      }),
      flatten
    )(formula)
  };
}

export default Formula
