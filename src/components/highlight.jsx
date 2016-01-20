import hljs from "highlight.js/lib/highlight";
import React, {PropTypes} from "react";


var Highlight = React.createClass({
  propTypes: {
    children: PropTypes.node.isRequired,
    language: PropTypes.string.isRequired,
  },
  componentDidMount() {
    this.highlightCode();
  },
  highlightCode() {
    hljs.highlightBlock(this.getDOMNode());
  },
  render() {
    return (
      <pre className={this.props.language}>
        {this.props.children}
      </pre>
    );
  },
});


export default Highlight;
