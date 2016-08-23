import {Link} from "react-router"
import {locationShape} from "react-router/lib/PropTypes"
import React from "react"
import DocumentTitle from "react-document-title"

import BreadCrumb from "../breadcrumb"


const NotFoundPage = React.createClass({
  propTypes: {
    location: locationShape,
  },
  render() {
    const message = "Page non trouvée"
    const {pathname} = this.props.location
    return (
      <DocumentTitle title={`${message} - Explorateur de la législation`}>
        <div>
          <BreadCrumb>
            <li className="active">{message}</li>
          </BreadCrumb>
          <div className="page-header">
            <h1>{message}</h1>
          </div>
          <div className="alert alert-danger">
            {`La page « ${pathname} » n'existe pas.`}
          </div>
          <Link to="/">Retour à l'accueil</Link>
        </div>
      </DocumentTitle>
    )
  },
})


export default NotFoundPage
