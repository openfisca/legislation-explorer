import hljs from "highlight.js/lib/highlight"
import React, {PropTypes} from "react"


const Highlight = React.createClass({
  propTypes: {
    children: PropTypes.node.isRequired,
    language: PropTypes.string.isRequired,
  },
  componentDidMount() {
    this.highlightCode()
  },
  highlightCode() {
    hljs.highlightBlock(this.refs.self)
  },
  render() {
    return (
      <pre className={this.props.language} ref="self">
        {this.props.children}
      </pre>
    )
  },
})


export default Highlight
