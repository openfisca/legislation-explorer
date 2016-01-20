import DocumentTitle from "react-document-title"
import React, {PropTypes} from "react"



var NotFoundPage = React.createClass({
  propTypes: {
    children: PropTypes.node,
    message: PropTypes.string,
  },
  getDefaultProps() {
    return {
      message: "Page non trouvée",
    }
  },
  render() {
    var {children, message} = this.props
    return (
      <DocumentTitle title={`${message} - Explorateur de la législation`}>
        <div>
          {children}
        </div>
      </DocumentTitle>
    )
  },
})


export default NotFoundPage
