import {Link} from "react-router"
import React, {PropTypes} from "react"


const FormulaSource = React.createClass({
  propTypes: {
    children: PropTypes.string.isRequired,
    inputVariableNames: PropTypes.arrayOf(PropTypes.string),
  },
  getSourceFragments(source, inputVariableNames) {
    return inputVariableNames.reduce((memo, inputVariable) => {
      let idx = 0
      return memo.reduce((fragmentMemo, fragment) => {
        if (fragment.source) {
          const inputVariableFragments = this.getSourceFragmentsForInputVariable(fragment.source, inputVariable)
          if (inputVariableFragments.length) {
            fragmentMemo.splice(idx, 1, ...inputVariableFragments)
          }
        }
        idx += 1
        return fragmentMemo
      }, memo)
    }, [{source}])
  },
  getSourceFragmentsForInputVariable(source, inputVariable) {
    const regexp = new RegExp(`['"](${inputVariable})['"]`, "g")
    let match
    let fragments = []
    while ((match = regexp.exec(source)) !== null) {
      const index = match.index + 1
      fragments = fragments.concat([
        {source: source.slice(0, index)},
        {inputVariable: source.slice(index, index + inputVariable.length)},
        {source: source.slice(index + inputVariable.length)},
      ])
    }
    return fragments
  },
  getSourceWithLinks(source, inputVariableNames) {
    const sourceFragments = inputVariableNames ?
      this.getSourceFragments(source, inputVariableNames) :
      [{source}]
    return (
      <div>
        {
          sourceFragments.map((fragment, idx) => fragment.source ? (
            <span key={idx}>{fragment.source}</span>
          ) : fragment.inputVariable ? (
            <Link key={idx} to={`/variables/${fragment.inputVariable}`}>
              <span
                aria-hidden="true"
                className="glyphicon glyphicon-link"
                style={{
                  color: "#2aa198", // Same color than Highlight.js variables.
                  marginRight: "0.3em",
                }}
              />
              <strong>{fragment.inputVariable}</strong>
            </Link>
          ) : null)
        }
      </div>
    )
  },
  render() {
    const {children, inputVariableNames} = this.props
    return (
      <div style={{
        fontFamily: "monospace",
        fontSize: 12,
        overflowWrap: "normal",
        whiteSpace: "pre",
      }}>
        {this.getSourceWithLinks(children, inputVariableNames)}
      </div>
    )
  },
})


export default FormulaSource
