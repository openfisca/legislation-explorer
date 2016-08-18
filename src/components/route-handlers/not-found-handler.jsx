import {Link} from "react-router"
import React from "react"

import BreadCrumb from "../breadcrumb"
import NotFoundPage from "../pages/not-found-page"


var NotFoundHandler = React.createClass({
  render() {
    var message = "Page non trouvée"
    return (
      <div>
        <BreadCrumb>
          <li className="active">{message}</li>
        </BreadCrumb>
        <div className="page-header">
          <h1>{message}</h1>
        </div>
        <NotFoundPage message={message}>
          <div className="alert alert-danger">
            {`La page « ${this.props.location.pathname} » n'existe pas.`}
          </div>
          <Link to="home">
            Retour à l'explorateur de la législation
          </Link>
        </NotFoundPage>
      </div>
    )
  },
})


export default NotFoundHandler
