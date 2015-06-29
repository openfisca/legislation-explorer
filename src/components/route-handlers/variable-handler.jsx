/*
OpenFisca -- A versatile microsimulation software
By: OpenFisca Team <contact@openfisca.fr>

Copyright (C) 2011, 2012, 2013, 2014, 2015 OpenFisca Team
https://github.com/openfisca

This file is part of OpenFisca.

OpenFisca is free software; you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

OpenFisca is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/


import {Link, State} from "react-router";
import DocumentTitle from "react-document-title";
import Immutable from "immutable";
import React, {PropTypes} from "react";

import {NotFound} from "../../errors";
import AppPropTypes from "../../app-prop-types";
import BreadCrumb from "../breadcrumb";
import NotFoundPage from "../pages/not-found-page";
import VariablePage from "../pages/variable-page";
import webservices from "../../webservices";


var VariableHandler = React.createClass({
  mixins: [State],
  propTypes: {
    dataByRouteName: PropTypes.shape({
      variable: PropTypes.shape({
        country_package_git_head_sha: PropTypes.string.isRequired,
        variable: AppPropTypes.variable.isRequired,
      }),
    }),
    errorByRouteName: PropTypes.shape({
      variable: PropTypes.instanceOf(Error),
    }),
    loading: AppPropTypes.loading,
  },
  statics: {
    fetchData(params) {
      return webservices.fetchVariables()
        .then(
          responseData => {
            var foundVariable = responseData.variables.find(variable => variable.name === params.name);
            if (!foundVariable) {
              throw new NotFound(`variable \"${params.name}\" not found`);
            }
            return Immutable.Map(responseData).set("variable", foundVariable).toJS();
          }
        );
    },
  },
  getNotFoundMessage() {
    return "Variable non trouvée";
  },
  render() {
    var name = this.getParams().name;
    var {dataByRouteName, errorByRouteName} = this.props;
    var error = errorByRouteName && errorByRouteName.variable;
    var data = dataByRouteName && dataByRouteName.variable;
    return (
      <DocumentTitle title={`${name} - Explorateur de la législation`}>
        <div>
          {this.renderBreadCrumb(error, name)}
          {this.renderPageHeader(data, error, name)}
          {this.renderContent(data, error, name)}
        </div>
      </DocumentTitle>
    );
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
    );
  },
  renderContent(data, error, name) {
    var content;
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
      );
    } else if (this.props.loading) {
      content = (
        <p>Chargement en cours…</p>
      );
    } else if (data) {
      const computedVariables = data.variables.filter(variable => variable.formula);
      content = (
        <VariablePage
          computedVariables={computedVariables}
          countryPackageGitHeadSha={data.country_package_git_head_sha}
          variable={data.variable}
        />
      );
    }
    return content;
  },
  renderPageHeader(data, error, name) {
    return (
      <div className="page-header">
        <h1 style={{display: "inline-block"}}>
          {
            error instanceof NotFound ?
              this.getNotFoundMessage() : (
                <p>{name}</p>
              )
          }
        </h1>
        {
          !(error instanceof NotFound) && (
            <div className="label label-info" style={{marginLeft: "1em"}}>
              {
                data ?
                  (data.variable.formula ? "Variable calculée" : "Variable d'entrée") :
                  "Variable"
              }
            </div>
          )
        }
      </div>
    );
  },
});


export default VariableHandler;
