import React, { PropTypes } from "react"
import { isNil } from "ramda"
import { locationShape } from "react-router/lib/PropTypes"
import { Link } from "react-router"

import * as AppPropTypes from "../../app-prop-types"
import NotFoundPage from "./not-found"
import Parameter from "../parameter"
import Variable from "../variable"


const ParameterOrVariablePage = React.createClass({
  propTypes: {
    countryPackageName: PropTypes.string.isRequired,
    countryPackageVersion: PropTypes.string.isRequired,
    currency: PropTypes.string.isRequired,
    location: locationShape.isRequired,
    params: PropTypes.shape({ name: PropTypes.string.isRequired }).isRequired, // URL params
    parameters: PropTypes.arrayOf(AppPropTypes.parameterOrScale).isRequired,
    variables: PropTypes.arrayOf(AppPropTypes.variable).isRequired,
  },
  render() {
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
    return (
      <div>
        <Link className="btn btn-default" to="/">Retour à l'accueil</Link>
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
