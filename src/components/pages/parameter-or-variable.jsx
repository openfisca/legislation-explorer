import React, { PropTypes } from "react"
import { isNil } from "ramda"
import { Link, locationShape } from "react-router"

import * as AppPropTypes from "../../app-prop-types"
import NotFoundPage from "./not-found"
import Parameter from "../parameter"
import Variable from "../variable"
import {searchInputId} from "./home"


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
  render() {
    const { searchQuery, searchResults } = this.context
    const {countryPackageName, countryPackageVersion, currency, location, parameters, params, variables} = this.props
    const {name} = params
    const parameter = parameters.find(parameter => parameter.name === name)
    const variable = variables.find(variable => variable.name === name)
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
