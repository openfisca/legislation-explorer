import {Link} from "react-router"
import React from "react"
import url from "url"

import config from "../config"


export default () => (
      <div className="navbar navbar-inverse navbar-static-top" role="navigation">
        <div className="container">
          <div className="navbar-header">
            <button
              className="navbar-toggle"
              data-target=".navbar-responsive-collapse"
              data-toggle="collapse"
              type="button"
            >
              <span className="sr-only">Basculer la navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href={config.websiteUrl}>OpenFisca</a>
          </div>
          <div className="collapse navbar-collapse navbar-responsive-collapse">
            <ul className="nav navbar-nav">
              <li><a href={url.resolve(config.websiteUrl, "/presentation")}>Présentation</a></li>
              <li><a href={url.resolve(config.websiteUrl, "/documentation")}>Documentation</a></li>
              <li><a href={url.resolve(config.websiteUrl, "/tools")}>Outils</a></li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li><Link to="about">À propos</Link></li>
              <li><a href={url.resolve(config.websiteUrl, "/contact")}>Contact</a></li>
            </ul>
          </div>
        </div>
      </div>)
