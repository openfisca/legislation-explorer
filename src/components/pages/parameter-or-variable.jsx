import React, { PropTypes } from "react"
import { isNil, isEmpty } from "ramda"
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
    return {parameter: {}, variable: variable}
  },
  componentDidMount() {
    if (! this.state.variable) {
      fetchParameter(this.props.params.name).then(
        parameter => {
          this.setState({parameter: parameter})
        }
      ).catch(
        () => this.setState({parameter: undefined})
      )
    }
  },
  render() {
    const { searchQuery, searchResults } = this.context
    const {countryPackageName, countryPackageVersion, currency, location, parameters, params, variables} = this.props
    const {name} = params
    const {parameter, variable} = this.state
    if (isNil(parameter) && isNil(variable)) {
      return (
        <NotFoundPage
          location={location}
          message={`« ${name} » n'est ni un paramètre ni une variable d'OpenFisca.`}
        />
      )
    }
    if (isEmpty(parameter) && isNil(variable)) {
      return (
        <p>Chargement des valeurs…</p>
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
          (! isEmpty(parameter)) && (
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
