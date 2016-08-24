import url from "url"

import DocumentTitle from "react-document-title"
import React, {PropTypes} from "react"

import config from "../config"


const App = React.createClass({
  propTypes: {
    children: PropTypes.node.isRequired,
  },
  render() {
    return (
      <DocumentTitle title="Explorateur de la législation">
        <div>
          <a className="sr-only" href="#content">Sauter au contenu principal</a>
          {this.renderNavBar()}
          <div className="container" id="content" style={{marginBottom: 100}}>
            {this.props.children}
          </div>
        </div>
      </DocumentTitle>
    )
  },
  renderNavBar() {
    return (
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
              <li><a href="http://doc.openfisca.fr/en/index.html">Documentation</a></li>
              <li><a href="https://forum.openfisca.fr/">Forum</a></li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li><a href={url.resolve(config.websiteUrl, "/contact")}>Contact</a></li>
            </ul>
          </div>
        </div>
      </div>
    )
  },
})

export default App
