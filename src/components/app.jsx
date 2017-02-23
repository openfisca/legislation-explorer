import url from "url"

import DocumentTitle from "react-document-title"
import React, {PropTypes} from "react"

import * as AppPropTypes from "../app-prop-types"
import config from "../config"


const App = React.createClass({
  propTypes: {
    children: PropTypes.node.isRequired,
    countryPackageName: PropTypes.string.isRequired,
    countryPackageVersion: PropTypes.string.isRequired,
    parameters: PropTypes.arrayOf(AppPropTypes.parameterOrScale).isRequired,
    variables: PropTypes.arrayOf(AppPropTypes.variable).isRequired,

  },
  render() {
    const {countryPackageName, countryPackageVersion, parameters, variables} = this.props
    return (
      <DocumentTitle title="Explorateur de la législation">
        <div>
          <a className="sr-only" href="#content">Sauter au contenu principal</a>
          <div className="container" id="content" style={{marginBottom: 100}}>
            <section className="jumbotron" style={{marginTop: "1em"}}>
              <div className="row">
                <div className="col-md-3">
                  <img
                    alt="OpenFisca"
                    src={url.resolve(config.websiteUrl, "/hotlinks/logo-openfisca.svg")}
                    style={{maxWidth: "12em"}}
                  />
                  <p>{countryPackageName}@{countryPackageVersion}</p>
                </div>
                <div className="col-md-9">
                  <p>
                    {variables.length} variables et {parameters.length} paramètres
                    référencées pour modéliser le système socio-fiscal français.
                  </p>
                  <a href={config.websiteUrl}>En savoir plus</a>
                </div>
              </div>
            </section>
            {this.props.children}
            <footer>
              <a href={config.gitWebpageUrl} rel="external" target="_blank">
                Améliorer ce site
              </a>
            </footer>
          </div>
        </div>
      </DocumentTitle>
    )
  },
})

export default App
