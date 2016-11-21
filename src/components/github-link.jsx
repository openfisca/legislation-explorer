import React, {PropTypes} from "react"

import config from "../config"
import ExternalLink from "./external-link"


const GitHubLink = React.createClass({
  propTypes: {
    blobUrlPath: PropTypes.string,
    children: PropTypes.func,
    className: PropTypes.string,
    commitReference: PropTypes.string,
    endLineNumber: PropTypes.number,
    lineNumber: PropTypes.number,
    style: PropTypes.object,
    text: PropTypes.string,
    title: PropTypes.string,
  },
  buildHref() {
    const {blobUrlPath, endLineNumber, lineNumber} = this.props
    const commitReference = config.useCommitReferenceFromApi ? this.props.commitReference : "master"
    let line = ""
    if (lineNumber) {
      line = `#L${lineNumber}`
    }
    if (endLineNumber) {
      line = `${line}-L${endLineNumber}`
    }
    return `https://github.com/${config.gitHubProject}/blob/${commitReference}/${blobUrlPath}${line}`
  },
  getDefaultProps() {
    return {
      commitReference: "master",
      text: "GitHub",
      title: "Voir sur GitHub",
    }
  },
  render() {
    const {children, className, style, text, title} = this.props
    return (
      <ExternalLink
        className={className}
        href={this.buildHref()}
        style={style}
        title={title}
      >
        {children ? children(text) : text}
      </ExternalLink>
    )
  },
})


export default GitHubLink
