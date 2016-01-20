import DocumentTitle from "react-document-title"
import React, {PropTypes} from "react"

import AppPropTypes from "../../app-prop-types"
import BreadCrumb from "../breadcrumb"
import ParametersPage from "../pages/parameters-page"
import webservices from "../../webservices"


var ParametersHandler = React.createClass({
  propTypes: {
    dataByRouteName: PropTypes.shape({
      parameters: PropTypes.shape({
        parameters: PropTypes.arrayOf(AppPropTypes.parameterOrScale).isRequired,
      }),
    }),
    errorByRouteName: PropTypes.shape({
      parameters: PropTypes.instanceOf(Error),
    }),
    loading: AppPropTypes.loading,
  },
  statics: {
    fetchData(params, query) {
      const apiBaseUrl = query && query.api_url
      return webservices.fetchParameters(apiBaseUrl)
    },
  },
  render() {
    var {dataByRouteName, errorByRouteName} = this.props
    var error = errorByRouteName && errorByRouteName.parameters
    var data = dataByRouteName && dataByRouteName.parameters
    return (
      <DocumentTitle title="Paramètres - Explorateur de la législation">
        <div>
          <BreadCrumb>
            <li className="active">Paramètres</li>
          </BreadCrumb>
          <div className="page-header">
            <h1>Paramètres de la législation</h1>
          </div>
          {this.renderContent(error, data)}
        </div>
      </DocumentTitle>
    )
  },
  renderContent(error, data) {
    var content
    if (error) {
      content = (
        <div className="alert alert-danger">
          Impossible de charger les données depuis l'API.
        </div>
      )
    } else if (this.props.loading) {
      content = (
        <p>Chargement en cours…</p>
      )
    } else if (data) {
      content = (
        <ParametersPage parameters={data.parameters} />
      )
    }
    return content
  },
})


export default ParametersHandler
