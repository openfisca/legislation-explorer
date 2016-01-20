import {Link, State} from "react-router";
import DocumentTitle from "react-document-title";
import Immutable from "immutable";
import React, {PropTypes} from "react";

import {NotFound} from "../../errors";
import AppPropTypes from "../../app-prop-types";
import BreadCrumb from "../breadcrumb";
import NotFoundPage from "../pages/not-found-page";
import ParameterPage from "../pages/parameter-page";
import webservices from "../../webservices";


var ParameterHandler = React.createClass({
  mixins: [State],
  propTypes: {
    dataByRouteName: PropTypes.shape({
      parameter: PropTypes.shape({
        parameter: PropTypes.shape({
          country_package_git_head_sha: PropTypes.string.isRequired,
          currency: PropTypes.string.isRequired,
          parameter: AppPropTypes.parameterOrScale.isRequired,
          parameters_file_path: PropTypes.string.isRequired,
        }),
        variables: PropTypes.shape({
          variables: PropTypes.arrayOf(AppPropTypes.variable).isRequired,
        }),
      }),
    }),
    errorByRouteName: PropTypes.shape({
      parameter: PropTypes.instanceOf(Error),
    }),
    loading: AppPropTypes.loading,
  },
  statics: {
    fetchData(params, query) {
      const apiBaseUrl = query && query.api_url;
      const parameterPromise = webservices.fetchParameters(apiBaseUrl)
        .then(
          responseData => {
            const foundParameter = responseData.parameters.find(parameter => parameter.name === params.name);
            if (!foundParameter) {
              throw new NotFound(`parameter \"${params.name}\" not found`);
            }
            return Object.assign({}, responseData, {parameter: foundParameter});
          }
        );
      const variablesPromise = webservices.fetchVariables(apiBaseUrl);
      var dataByPromiseName = {};
      return Promise.all(
        [
          parameterPromise.then(data => { dataByPromiseName.parameter = data; }),
          variablesPromise.then(data => { dataByPromiseName.variables = data; }),
        ]
      ).then(() => dataByPromiseName);
    },
  },
  getHyphenatedName(name) {
    var hyphenate = (text, separator) => Immutable.List(text.split(separator))
      .interpose(<span>.<wbr /></span>).toJS();
    var hyphenatedName = hyphenate(name, ".").map((name_fragment, idx) => <span key={idx}>{name_fragment}</span>);
    return hyphenatedName;
  },
  getNotFoundMessage() {
    return "Paramètre non trouvée";
  },
  render() {
    var name = this.getParams().name;
    var hyphenatedName = this.getHyphenatedName(name);
    var {dataByRouteName, errorByRouteName} = this.props;
    var error = errorByRouteName && errorByRouteName.parameter;
    var dataByPromiseName = dataByRouteName && dataByRouteName.parameter;
    return (
      <DocumentTitle title={`${name} - Explorateur de la législation`}>
        <div>
          {this.renderBreadCrumb(error, hyphenatedName)}
          {this.renderPageHeader(error, hyphenatedName)}
          {this.renderContent(dataByPromiseName, error)}
        </div>
      </DocumentTitle>
    );
  },
  renderBreadCrumb(error, hyphenatedName) {
    return (
      <BreadCrumb>
        <li key="parameters">
          <Link to="parameters">Paramètres</Link>
        </li>
        <li className="active">
          {error instanceof NotFound ? this.getNotFoundMessage() : hyphenatedName}
        </li>
      </BreadCrumb>
    );
  },
  renderContent(dataByPromiseName, error) {
    var content;
    if (error) {
      var name = this.getParams().name;
      content = error instanceof NotFound ? (
        <NotFoundPage message={this.getNotFoundMessage()}>
          <div className="alert alert-danger">
            {`Le paramètre « ${name} » n'existe pas.`}
          </div>
          <Link to="parameters">
            Retour aux paramètres de la législation
          </Link>
        </NotFoundPage>
      ) : (
        <div className="alert alert-danger">
          Impossible de charger les données depuis l'API.
        </div>
      );
    } else if (this.props.loading) {
      content = (
        <p>Chargement en cours…</p>
      );
    } else if (dataByPromiseName) {
      const parameterPromiseData = dataByPromiseName.parameter;
      const variablesPromiseData = dataByPromiseName.variables;
      const computedVariables = variablesPromiseData.variables.filter(variable => variable.formula);
      content = (
        <ParameterPage
          computedVariables={computedVariables}
          countryPackageGitHeadSha={parameterPromiseData.country_package_git_head_sha}
          currency={parameterPromiseData.currency}
          parameter={parameterPromiseData.parameter}
          parametersUrlPath={parameterPromiseData.parameters_file_path}
        />
      );
    }
    return content;
  },
  renderPageHeader(error, hyphenatedName) {
    return (
      <div className="page-header">
        <h1 style={{display: "inline-block"}}>
          {
            error instanceof NotFound ?
              this.getNotFoundMessage() : (
                <p>{hyphenatedName}</p>
              )
          }
        </h1>
        {
          !(error instanceof NotFound) && (
            <div className="label label-info" style={{marginLeft: "1em"}}>
              Paramètre
            </div>
          )
        }
      </div>
    );
  },
});


export default ParameterHandler;
