import {Link} from "react-router"
import classNames from "classnames"
import ImmutableRenderMixin from "react-immutable-render-mixin"
import React, {PropTypes} from "react"

import GitHubLink from "../github-link"


// const debug = require("debug")("app:VariablesTree")


var VariablesTree = React.createClass({
  mixins: [ImmutableRenderMixin],
  propTypes: {
    countryPackageVersion: PropTypes.string.isRequired,
    cursor: PropTypes.object.isRequired,
  },
  handleChildClick(event, childName) {
    event.preventDefault()
    var {cursor} = this.props
    var openedPath = ["children", childName, "opened"]
    cursor.updateIn(openedPath, opened => !(opened || typeof opened === "undefined"))
  },
  render() {
    var {cursor} = this.props
    var children = cursor.get("children")
    var variables = cursor.get("variables")
    return (
      <div>
        {
          children && children.mapEntries(
            (kv, idx) => [kv[0], this.renderChild(kv[0], kv[1], idx)]
          ).toArray()
        }
        {
          variables && (
            <ul style={{margin: 0, paddingLeft: 20}}>
              {
                variables.map(
                  (variable, idx) => this.renderVariableListItem(variable.toJS(), idx)
                ).toArray()
              }
            </ul>
          )
        }
      </div>
    )
  },
  renderChild(childName, child, idx) {
    var isOpened = child.get("opened") || typeof child.get("opened") === "undefined"
    return (
      <div className={classNames({hide: !child.get("hasMatchingVariables")})} key={idx}>
        <a href="#" onClick={event => this.handleChildClick(event, childName)}>
          <span
            aria-hidden="true"
            className={
              classNames("glyphicon", isOpened ? "glyphicon-chevron-down" : "glyphicon-chevron-right")
            }
          ></span>
          {" "}
          {childName}
        </a>
        <div className={classNames({hide: !isOpened})} style={{marginLeft: 20}}>
          <VariablesTree
            countryPackageVersion={this.props.countryPackageVersion}
            cursor={this.props.cursor.cursor(["children", childName])}
          />
        </div>
      </div>
    )
  },
  renderVariableListItem(variable, idx) {
    const {countryPackageVersion} = this.props
    const {label, line_number, matches, module, name} = variable
    return (
      <li className={classNames({hide: !matches})} key={idx}>
        <Link params={variable} to="variable">{name}</Link>
        {" : "}
        {
          label || (
            <span className="label label-warning">
              aucun libellé
              <GitHubLink
                blobUrlPath={`${module.split(".").join("/")}.py`}
                commitReference={countryPackageVersion}
                lineNumber={line_number}
                style={{marginLeft: "1em"}}
                text="ajouter"
                title="Ajouter un libellé via GitHub"
              />
            </span>
          )
        }
      </li>
    )
  },
})


export default VariablesTree
