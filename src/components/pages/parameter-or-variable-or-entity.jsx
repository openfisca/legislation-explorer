import React from 'react'
import PropTypes from 'prop-types'
import { Link, locationShape, routerShape } from 'react-router'
import { FormattedMessage } from 'react-intl'

import { entityShape, parameterShape, variableShape } from '../../openfisca-proptypes'
import Entity from '../entity'
import Parameter from '../parameter'
import Variable from '../variable'
import { searchInputId } from './home'
import { fetchEntities, fetchParameter, fetchVariable } from '../../webservices'


class CountryModelItemPage extends React.Component {
  static contextTypes = {
    router: routerShape.isRequired,
    searchQuery: PropTypes.string.isRequired,
    searchResults: PropTypes.array.isRequired,
  };

  static propTypes = {
    countryPackageName: PropTypes.string.isRequired,
    countryPackageVersion: PropTypes.string.isRequired,
    location: locationShape.isRequired,
    params: PropTypes.shape({ name: PropTypes.string.isRequired }).isRequired, // URL params
    entities: PropTypes.objectOf(entityShape).isRequired,
    parameters: PropTypes.objectOf(parameterShape).isRequired,
    variables: PropTypes.objectOf(variableShape).isRequired,
  };

  state = {variable: null, parameter: null, entityId: null, entity: null, waitingForResponse: true};

  fetchPageContent = (name) => {
    if (this.props.variables[name]) {
      fetchVariable(name)
        .then(variable => {
          this.setState({variable: variable.data, waitingForResponse: false})
        })
        .catch(error => {
          this.setState({error: error, waitingForResponse: false})
        })
    } else if (this.props.parameters[name]) {
      fetchParameter(name)
        .then(parameter => {
          this.setState({parameter: parameter.data, waitingForResponse: false})
        })
        .catch(error => {
          this.setState({error: error, waitingForResponse: false})
        })
    } else if (this.props.entities[name]) {
      fetchEntities()
        .then(entities => {
          this.setState({entityId: name, entity: entities.data[name], waitingForResponse: false})
        })
        .catch(error => {
          this.setState({error: error, waitingForResponse: false})
        })
    } else {
      this.setState({waitingForResponse: false})
      this.handleNotFound()
    }
  };

  componentDidUpdate(prevProps) {
    if (this.props.params.name != prevProps.params.name) {
      this.fetchPageContent(this.props.params.name)
    }
  }

  componentDidMount() {
    this.fetchPageContent(this.props.params.name)
  }

  handleNotFound = () => {
    const name = this.props.params.name
    return this.context.router.push({
      pathname: '/',
      query: {q: name, is404: true},
      hash: '#not-found',
    })
  };

  render() {
    const { searchQuery, searchResults } = this.context
    const { countryPackageName, countryPackageVersion, parameters, variables, entities } = this.props
    const { parameter, variable, entityId, entity } = this.state
    
    const goBackLocation = {
      pathname: '/',
      query: {q: searchQuery},
      hash: `#${searchInputId}`,
    }
    const otherResultsCount = searchResults.length - 1

    if (this.state.error) {
      return (
        <div className="alert alert-danger">
          <h1>
            <span className="glyphicon glyphicon-alert"></span>
            <FormattedMessage id="api-error"/>
          </h1>
          <samp>{this.state.error.message}</samp>
        </div>
      )
    }

    if (this.state.waitingForResponse) {
      return (
        <div className="loading">
          <span className="glyphicon glyphicon-refresh"></span>
          <FormattedMessage id="loading"/>
        </div>
      )
    }

    return (
      <div>
        <Link className="btn btn-default" to={goBackLocation}>
          <FormattedMessage id={ otherResultsCount > 1 ? 'seeOtherResults' : 'backToHP' }
            values={{ otherResultsCount }}
          />
        </Link>
        {
          parameter && (
            <Parameter
              countryPackageName={countryPackageName}
              countryPackageVersion={countryPackageVersion}
              parameter={parameter}
            />
          )
        }
        {
          variable && (
            <Variable
              countryPackageName={countryPackageName}
              countryPackageVersion={countryPackageVersion}
              parameters={parameters}
              variable={variable}
              variables={variables}
            />
          )
        }
        {
          entityId && entity && (
            <Entity
              countryPackageName={countryPackageName}
              countryPackageVersion={countryPackageVersion}
              entityId={entityId}
              entity={entity}
            />
          )
        }
      </div>
    )
  }
}


export default CountryModelItemPage
