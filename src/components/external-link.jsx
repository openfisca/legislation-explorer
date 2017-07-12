import React, {PropTypes} from "react"


const ExternalLink = React.createClass({
  propTypes: {
    children: PropTypes.node,
  },
  render() {
    const {children, ...otherProps} = this.props
    return (
      <a rel="external" target="_blank" {...otherProps}>
        {children && " "}
        {children}
      </a>
    )
  },
})


export default ExternalLink
