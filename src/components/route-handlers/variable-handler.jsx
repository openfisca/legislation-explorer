import {Link, State} from "react-router"
import DocumentTitle from "react-document-title"
import React, {PropTypes} from "react"

import {NotFound} from "../../errors"
import AppPropTypes from "../../app-prop-types"
import BreadCrumb from "../breadcrumb"
import NotFoundPage from "../pages/not-found-page"
import VariablePage from "../pages/variable-page"
import webservices from "../../webservices"


var VariableHandler = React.createClass({
  propTypes: {
    dataByRouteName: PropTypes.shape({
      variable: PropTypes.shape({
        parameters: PropTypes.shape({
          parameters: PropTypes.arrayOf(AppPropTypes.parameterOrScale).isRequired,
        }),
        variable: PropTypes.shape({
          country_package_version: PropTypes.string.isRequired,
          variable: AppPropTypes.variable.isRequired,
        }),
      }),
    }),
    errorByRouteName: PropTypes.shape({
      variable: PropTypes.instanceOf(Error),
    }),
    loading: AppPropTypes.loading,
  },
  statics: {
    fetchData(params, query) {
      const apiBaseUrl = query && query.api_url
      const parametersPromise = webservices.fetchParameters(apiBaseUrl)
      const variablesPromise = webservices.fetchVariables(apiBaseUrl)
        .then(
          responseData => {
            var foundVariable = responseData.variables.find(variable => variable.name === params.name)
            if (!foundVariable) {
              throw new NotFound(`variable \"${params.name}\" not found`)
            }
            return Object.assign({}, responseData, {variable: foundVariable})
          }
        )
      var dataByPromiseName = {}
      return Promise.all(
        [
          parametersPromise.then(data => { dataByPromiseName.parameters = data }),
          variablesPromise.then(data => { dataByPromiseName.variables = data }),
        ]
      ).then(() => dataByPromiseName)
    },
  },
  getNotFoundMessage() {
    return "Variable non trouvée"
  },
  render() {
    var name = this.props.params.name
    var {dataByRouteName, errorByRouteName} = this.props
    var error = errorByRouteName && errorByRouteName.variable
    var dataByPromiseName = dataByRouteName && dataByRouteName.variable
    return (
      <DocumentTitle title={`${name} - Explorateur de la législation`}>
        <div>
          {this.renderBreadCrumb(error, name)}
          {this.renderContent(dataByPromiseName, error, name)}
        </div>
      </DocumentTitle>
    )
  },
  renderBreadCrumb(error, name) {
    return (
      <BreadCrumb>
        <li key="variables">
          <Link to="variables">Variables</Link>
        </li>
        <li className="active">
          {error instanceof NotFound ? this.getNotFoundMessage() : name}
        </li>
      </BreadCrumb>
    )
  },
  renderContent(dataByPromiseName, error, name) {
    var content
    if (error) {
      content = error instanceof NotFound ? (
        <NotFoundPage message={this.getNotFoundMessage()}>
          <div className="alert alert-danger">
            {`La variable « ${name} » n'existe pas.`}
          </div>
          <Link to="variables">
            Retour aux variables et formules socio-fiscales
          </Link>
        </NotFoundPage>
      ) : (
        <div className="alert alert-danger">
          Impossible de charger les données depuis l'API.
        </div>
      )
    } else if (this.props.loading) {
      content = (
        <p>Chargement en cours…</p>
      )
    } else if (dataByPromiseName) {
      const parametersPromiseData = dataByPromiseName.parameters
      const variablesPromiseData = dataByPromiseName.variables
      const computedVariables = variablesPromiseData.variables.filter(variable => variable.formula)
      content = (
        <VariablePage
          computedVariables={computedVariables}
          countryPackageVersion={variablesPromiseData.country_package_version}
          parameters={parametersPromiseData.parameters}
          variable={variablesPromiseData.variable}
        />
      )
    }
    return content
  }
})


export default VariableHandler
