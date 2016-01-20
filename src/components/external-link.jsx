import React, {PropTypes} from "react";


const ExternalLink = React.createClass({
  propTypes: {
    children: PropTypes.node.isRequired,
  },
  render() {
    const {children, ...otherProps} = this.props;
    return (
      <a rel="external" target="_blank" {...otherProps}>
        <span aria-hidden="true" className="glyphicon glyphicon-new-window"></span>
        {" "}
        {children}
      </a>
    );
  },
});


export default ExternalLink;
