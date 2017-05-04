import React, { PropTypes } from "react"
import { isNil } from "ramda"
import { Link, locationShape } from "react-router"

import * as AppPropTypes from "../../app-prop-types"
import NotFoundPage from "./not-found"
import Parameter from "../parameter"
import Variable from "../variable"
import { searchInputId } from "./home"
import { fetchParameter, fetchVariable } from "../../webservices"


const ParameterOrVariablePage = React.createClass({
  contextTypes: {
    searchQuery: PropTypes.string.isRequired,
    searchResults: PropTypes.array.isRequired,
  },
  propTypes: {
    countryPackageName: PropTypes.string.isRequired,
    countryPackageVersion: PropTypes.string.isRequired,
    location: locationShape.isRequired,
    params: PropTypes.shape({ name: PropTypes.string.isRequired }).isRequired, // URL params
    parameters: PropTypes.objectOf(AppPropTypes.parameter).isRequired,
    variables: PropTypes.objectOf(AppPropTypes.variable).isRequired,
  },
  getInitialState() {
    return {variable: null, parameter: null, waitingForResponse: true}
  },
  componentDidMount() {
    const name = this.props.params.name
    if (this.props.variables[name]) {
      fetchVariable(name).then(
        variable => {
          this.setState({variable: variable.data, waitingForResponse: false})
        }
      )
    } else if (this.props.parameters[name]) {
      fetchParameter(name).then(
        parameter => {
          this.setState({parameter: parameter.data, waitingForResponse: false})
        }
      )
    } else {
        this.setState({waitingForResponse: false})
    }
  },
  render() {
    const { searchQuery, searchResults } = this.context
    const {countryPackageName, countryPackageVersion, location, parameters, params, variables} = this.props
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
      </div>
    )
  },
})


export default ParameterOrVariablePage
