import {Link} from "react-router"
import classNames from "classnames"
import React, {PropTypes} from "react"
import url from "url"

import config from "../config"


const BreadCrumb = React.createClass({
  propTypes: {
    children: PropTypes.node,
  },
  render() {
    const {children} = this.props
    return (
      <ul className="breadcrumb">
        <li>
          <a href={config.websiteUrl}>Accueil</a>
        </li>
        <li>
          <a href={url.resolve(config.websiteUrl, "/tools")}>Outils</a>
        </li>
        <li className={classNames({active: !children})}>
          {
            children ? (
              <Link to="/">Explorateur de la législation</Link>
            ) : (
              "Explorateur de la législation"
            )
          }
        </li>
        {children}
      </ul>
    )
  },
})


export default BreadCrumb
