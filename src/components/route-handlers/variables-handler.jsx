import DocumentTitle from "react-document-title"
import React, {PropTypes} from "react"

import AppPropTypes from "../../app-prop-types"
import BreadCrumb from "../breadcrumb"
import VariablesPage from "../pages/variables-page"
import webservices from "../../webservices"


var VariablesHandler = React.createClass({
  propTypes: {
    dataByRouteName: PropTypes.shape({
      variables: PropTypes.shape({
        country_package_git_head_sha: PropTypes.string.isRequired,
        variables: PropTypes.arrayOf(AppPropTypes.variable).isRequired,
      }),
    }),
    errorByRouteName: PropTypes.shape({
      variables: PropTypes.instanceOf(Error),
    }),
    loading: AppPropTypes.loading,
  },
  statics: {
    fetchData(params, query) {
      const apiBaseUrl = query && query.api_url
      return webservices.fetchVariables(apiBaseUrl)
    },
  },
  render() {
    var {dataByRouteName, errorByRouteName} = this.props
    var error = errorByRouteName && errorByRouteName.variables
    var data = dataByRouteName && dataByRouteName.variables
    return (
      <DocumentTitle title="Variables - Explorateur de la législation">
        <div>
          <BreadCrumb>
            <li className="active">Variables</li>
          </BreadCrumb>
          <div className="page-header">
            <h1>Variables et formules socio-fiscales</h1>
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
        <VariablesPage
          countryPackageGitHeadSha={data.country_package_git_head_sha}
          variables={data.variables}
        />
      )
    }
    return content
  },
})


export default VariablesHandler
