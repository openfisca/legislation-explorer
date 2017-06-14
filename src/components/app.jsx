import url from "url"

import DocumentTitle from "react-document-title"
import React, {PropTypes} from "react"
import {locationShape, Link} from "react-router"
import {defineMessages, FormattedMessage} from "react-intl"

import * as AppPropTypes from "../app-prop-types"
import config from "../config"
import {findParametersAndVariables} from "../search"


const messages = defineMessages({
    header: {
        id: 'header',
        defaultMessage: 'OpenFisca rend le droit calculable. '
          + 'Il s’agit d’un moteur de calcul libre et ouvert qui permet de modéliser le système socio-fiscal de manière collaborative et transparente. '
          + 'Ce logiciel est utilisé par des chercheurs en économie et des services publics.',
    },
    stats: {
        id: 'stats',
        defaultMessage: '{nbv, number} variables et {nbp, number} paramètres référencés pour modéliser le système socio-fiscal français.',
    },
})


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
                    <FormattedMessage {...messages.header} />
                    <br/>
                    <br/>
                    <small>
                      <FormattedMessage {...messages.stats} values={{nbv: Object.keys(variables).length, nbp: Object.keys(parameters).length}}/>
                    </small>
                  </p>
                  <a href={config.websiteUrl}>En savoir plus</a>
                  <nav className="btn-group btn-group-lg">
                    <Link to="/" className={"btn btn-primary" + (this.isCurrentRoute("/") ? " active" : "")}>
                      Législation
                    </Link>
                    <Link to="/swagger" className={"btn btn-primary" + (this.isCurrentRoute("/swagger") ? " active" : "")}>
                      API
                    </Link>
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
