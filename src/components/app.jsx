
import DocumentTitle from "react-document-title"
import React, {PropTypes} from "react"
import {locationShape, Link} from "react-router"
import {FormattedMessage} from "react-intl"
import ExternalLink from "./external-link"

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
        <div className="container">
          <header className="jumbotron">
            <div className="row">
              <div className="col-md-3 openfiscaPresentation">
                <img
                  alt="OpenFisca"
                  src="https://openfisca.org/img/logo-openfisca.svg"
                />
                <code id="country-package-info">
                  {countryPackageName}@{countryPackageVersion}
                </code>
                <p>
                  <FormattedMessage id="cta_openfisca"
                    values={{
                      cta_openfisca_link: <ExternalLink href="https://openfisca.org" target="_blank">
                          OpenFisca
                        </ExternalLink>
                    }}
                  />
                </p>
              </div>
              <div className="col-md-9">
                <h1>
                  { /* Self-reference strings to allow for config override of static strings. */}
                  <FormattedMessage id="cta_header"
                    values={{ forCountry:
                      <FormattedMessage id="forCountry"
                        values={{ countryName: <FormattedMessage id="countryName"/> }}
                      />
                    }}
                  />
                </h1>
                <p>
                  <FormattedMessage id="cta_explore"
                    values={{
                      parametersCount: Object.keys(parameters).length,
                      variablesCount: Object.keys(variables).length,
                      cta_explore_link:
                        <Link to="#search-input">
                          <FormattedMessage id="cta_explore_text"/>
                        </Link>
                    }}
                  />
                </p>
                <p>
                  <FormattedMessage id="cta_api"
                    values={{
                      cta_api_link:
                        <Link to="/swagger">
                          <FormattedMessage id="cta_api_text"/>
                        </Link>
                    }}
                  />
                </p>
              </div>
            </div>
          </header>

          {this.props.children}

          <footer>
            <a href={config.gitWebpageUrl} target="_blank">
              Améliorer ce site
            </a>
          </footer>
        </div>
      </DocumentTitle>
    )
  },
})

export default App
