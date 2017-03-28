import React, { PropTypes } from "react"
import { isNil } from "ramda"
import { Link, locationShape } from "react-router"

import * as AppPropTypes from "../../app-prop-types"
import NotFoundPage from "./not-found"
import Parameter from "../parameter"
import Variable from "../variable"
import {searchInputId} from "./home"
import {fetchParameter} from "../../webservices"


const ParameterOrVariablePage = React.createClass({
  contextTypes: {
    searchQuery: PropTypes.string.isRequired,
    searchResults: PropTypes.array.isRequired,
  },
  propTypes: {
    countryPackageName: PropTypes.string.isRequired,
    countryPackageVersion: PropTypes.string.isRequired,
    currency: PropTypes.string.isRequired,
    location: locationShape.isRequired,
    params: PropTypes.shape({ name: PropTypes.string.isRequired }).isRequired, // URL params
    parameters: PropTypes.objectOf(AppPropTypes.parameterOrScale).isRequired,
    variables: PropTypes.arrayOf(AppPropTypes.variable).isRequired,
  },
  getInitialState() {
    const variable = this.props.variables.find(variable => variable.name === this.props.params.name)
    return {variable: variable, parameter: null, waitingForResponse: true}
  },
  componentDidMount() {
    // If there is a variable matching the name, we don't need fetch the parameter API
    if (! this.state.variable) {
      fetchParameter(this.props.params.name).then(
        parameter => {
          this.setState({parameter: parameter, waitingForResponse: false})
        }
      ).catch(
        () => this.setState({waitingForResponse: false})
      )
    } else {
      this.setState({waitingForResponse: false})
    }
  },
  render() {
    const { searchQuery, searchResults } = this.context
    const {countryPackageName, countryPackageVersion, currency, location, parameters, params, variables} = this.props
    const {name} = params
    const {parameter, variable} = this.state

    if (this.state.waitingForResponse) {
      return (
        <p>Chargement des valeurs…</p>
      )
    }

    if (isNil(parameter) && isNil(variable)) {
      return (
        <NotFoundPage
          location={location}
          message={`« ${name} » n'est ni un paramètre ni une variable d'OpenFisca.`}
        />
      )
    }
    const goBackLocation = {
      pathname: "/",
      query: {q: searchQuery},
      hash: `#${searchInputId}`,
    }
    return (
      <div>
        <Link className="btn btn-default" to={goBackLocation}>
          {
            do {
              const count = searchResults.length - 1
              count > 1
                ? `Voir les ${count} autres variables et paramètres`
                : "Voir la page de recherche"
            }
          }
        </Link>
        {
          parameter && (
            <Parameter
              countryPackageName={countryPackageName}
              countryPackageVersion={countryPackageVersion}
              currency={currency}
              parameter={parameter}
              parameters={parameters}
              variables={variables}
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
      </div>
    )
  },
})


export default ParameterOrVariablePage
