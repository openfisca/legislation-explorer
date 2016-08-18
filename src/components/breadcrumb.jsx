import {Link} from "react-router"
import classNames from "classnames"
import React, {PropTypes} from "react"
import url from "url"

import config from "../config"


var BreadCrumb = React.createClass({
  propTypes: {
    children: PropTypes.node,
  },
  render() {
    return (
      <ul className="breadcrumb">
        <li>
          <a href={config.websiteUrl}>Accueil</a>
        </li>
        <li>
          <a href={url.resolve(config.websiteUrl, "/tools")}>Outils</a>
        </li>
        <li className={classNames({active: !this.props.children})}>
          {
            this.props.children ? (
              <Link to="home">Explorateur de la législation</Link>
            ) : (
              "Explorateur de la législation"
            )
          }
        </li>
        {this.props.children}
      </ul>
    )
  },
})


export default BreadCrumb
