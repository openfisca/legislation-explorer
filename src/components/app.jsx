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
                <div className="col-lg-3">
                  <p>
                    <img
                      alt="Logo OpenFisca"
                      className="img-responsive"
                      src={url.resolve(config.websiteUrl, "/hotlinks/logo-openfisca.svg")}
                    />
                  </p>
                  <p>{countryPackageName}@{countryPackageVersion}</p>
                </div>
                <div className="col-lg-9">
                  <p>
                    OpenFisca référence {variables.length} variables et {parameters.length} paramètres
                    qui modélisent le système socio-fiscal français.
                  </p>
                  <a href={config.websiteUrl}>En savoir plus</a>
                </div>
              </div>
            </section>
            {this.props.children}
          </div>
        </div>
      </DocumentTitle>
    )
  },
})

export default App
