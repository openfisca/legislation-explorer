import {Link} from "react-router"
import {locationShape} from "react-router/lib/PropTypes"
import React, {PropTypes} from "react"
import DocumentTitle from "react-document-title"


const NotFoundPage = React.createClass({
  propTypes: {
    location: locationShape.isRequired,
    message: PropTypes.string,
  },
  render() {
    const {pathname} = this.props.location
    const message = this.props.message || `La page « ${pathname} » n'existe pas.`
    return (
      <DocumentTitle title={`Page non trouvée - Explorateur de la législation`}>
        <div>
          <div className="page-header">
            <h1>Page non trouvée</h1>
          </div>
          <div className="alert alert-danger">
            {message}
          </div>
          <Link className="btn btn-default" to="/">Retour à l'accueil</Link>
        </div>
      </DocumentTitle>
    )
  },
})


export default NotFoundPage
