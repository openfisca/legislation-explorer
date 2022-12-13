import DocumentTitle from 'react-document-title'
import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import {FormattedMessage, injectIntl, intlShape} from 'react-intl'

import { entityShape, locationShape, parameterShape, variableShape } from '../utils/proptypes'
import search from '../utils/search'

class App extends React.Component {
  static childContextTypes = {
    searchQuery: PropTypes.string,
    searchResults: PropTypes.array,
    setSearchQuery: PropTypes.func,
  }

  static propTypes = {
    children: PropTypes.node.isRequired,
    countryPackageName: PropTypes.string.isRequired,
    countryPackageVersion: PropTypes.string.isRequired,
    location: locationShape.isRequired,
    entities: PropTypes.objectOf(entityShape).isRequired,
    parameters: PropTypes.objectOf(parameterShape).isRequired,
    variables: PropTypes.objectOf(variableShape).isRequired,
  }

  constructor(props) {
    super(props)
    const {location, entities, parameters, variables} = props
    const searchQuery = location.query.q || ''

    this.state = {
      searchQuery,
      searchResults: search.findCountryModelItems(entities, parameters, variables, searchQuery),
    }
  }

  getChildContext() {
    const {entities, parameters, variables} = this.props
    return {
      searchQuery: this.state.searchQuery,
      searchResults: this.state.searchResults,
      setSearchQuery: searchQuery => {
        this.setState({
          searchQuery,
          searchResults: search.findCountryModelItems(entities, parameters, variables, searchQuery),
        })
      },
    }
  }

  isCurrentRoute = (route) => {
    return this.props.location.pathname == route
  };

  render() {
    const {countryPackageName, countryPackageVersion, parameters, variables} = this.props
    return (
      <DocumentTitle title={this.props.intl.formatMessage({ id: 'appName' })}>
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
                    values={{ cta_openfisca_link: <a href="https://openfisca.org">OpenFisca</a> }}
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
            <a href="https://github.com/openfisca/legislation-explorer" rel="noopener" target="_blank">
              <FormattedMessage id="improveThisApp"/>
            </a>
          </footer>
        </div>
      </DocumentTitle>
    )
  }
}


App.propTypes = {
  intl: intlShape.isRequired
}

export default injectIntl(App)
