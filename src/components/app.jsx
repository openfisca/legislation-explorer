import url from "url"

import DocumentTitle from "react-document-title"
import React, {PropTypes} from "react"
import {locationShape} from "react-router"

import * as AppPropTypes from "../app-prop-types"
import config from "../config"
import {findParametersAndVariables} from "../search"


const App = React.createClass({
  childContextTypes: {
    searchQuery: PropTypes.string,
    searchResults: PropTypes.array,
    setSearchQuery: PropTypes.func,
  },
  propTypes: {
    children: PropTypes.node.isRequired,
    countryPackageName: PropTypes.string.isRequired,
    countryPackageVersion: PropTypes.string.isRequired,
    location: locationShape.isRequired,
    parameters: PropTypes.objectOf(AppPropTypes.parameter).isRequired,
    variables: PropTypes.objectOf(AppPropTypes.variable).isRequired,
  },
  getChildContext() {
    const {parameters, variables} = this.props
    return {
      searchQuery: this.state.searchQuery,
      searchResults: this.state.searchResults,
      setSearchQuery: searchQuery => {
        this.setState({
          searchQuery,
          searchResults: findParametersAndVariables(parameters, variables, searchQuery),
        })
      },
    }
  },
  getInitialState() {
    const {location, parameters, variables} = this.props
    const searchQuery = location.query.q || ""
    return {
      searchQuery,
      searchResults: findParametersAndVariables(parameters, variables, searchQuery),
    }
  },
  isCurrentRoute(route) {
    return this.props.location.pathname == route
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
                  <p id="country-package-info">
                    {countryPackageName}@{countryPackageVersion}
                  </p>
                </div>
                <div className="col-md-9">
                  <p id="baseline">
                    {Object.keys(variables).length} variables et {Object.keys(parameters).length} paramètres
                    référencés pour modéliser le système socio-fiscal français.
                  </p>
                  <a href={config.websiteUrl}>En savoir plus</a>
                  <nav className="btn-group btn-group-lg">
                    <a href="/" className={"btn btn-primary" + (this.isCurrentRoute("/") ? " active" : "")}>
                      Législation
                    </a>
                    <a href="/swagger" className={"btn btn-primary" + (this.isCurrentRoute("/swagger") ? " active" : "")}>
                      API
                    </a>
                  </nav>
                </div>
              </div>
            </section>
            {this.props.children}
            <footer>
              <a href={config.gitWebpageUrl} target="_blank">
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
