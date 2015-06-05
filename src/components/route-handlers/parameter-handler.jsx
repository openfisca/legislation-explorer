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
import React, {PropTypes} from "react/addons";

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
        country_package_git_head_sha: PropTypes.string.isRequired,
        currency: PropTypes.string.isRequired,
        parameters_file_path: PropTypes.string.isRequired,
        parameter: AppPropTypes.parameter.isRequired,
      }),
    }),
    errorByRouteName: PropTypes.shape({
      parameter: PropTypes.instanceOf(Error),
    }),
    loading: AppPropTypes.loading,
  },
  statics: {
    fetchData(params) {
      return webservices.fetchParameters()
        .then(
          responseData => {
            var foundParameter = responseData.parameters.find(parameter => parameter.name === params.name);
            if (!foundParameter) {
              throw new NotFound(`parameter \"${params.name}\" not found`);
            }
            return Immutable.Map(responseData).set("parameter", foundParameter).toJS();
          }
        );
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
    var data = dataByRouteName && dataByRouteName.parameter;
    return (
      <DocumentTitle title={`${name} - Explorateur de la législation`}>
        <div>
          {this.renderBreadCrumb(error, hyphenatedName)}
          {this.renderPageHeader(error, hyphenatedName)}
          {this.renderContent(error, data, hyphenatedName)}
        </div>
      </DocumentTitle>
    );
  },
  renderBreadCrumb(error, name) {
    return (
      <BreadCrumb>
        <li key="parameters">
          <Link to="parameters">Paramètres</Link>
        </li>
        <li className="active">
          {error instanceof NotFound ? this.getNotFoundMessage() : name}
        </li>
      </BreadCrumb>
    );
  },
  renderContent(error, data, name) {
    var content;
    if (error) {
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
    } else if (data) {
      content = (
        <ParameterPage
          countryPackageGitHeadSha={data.country_package_git_head_sha}
          currency={data.currency}
          parameter={data.parameter}
          parametersUrlPath={data.parameters_file_path}
        />
      );
    }
    return content;
  },
  renderPageHeader(error, name) {
    return (
      <div className="page-header">
        <h1>
          {error instanceof NotFound ? this.getNotFoundMessage() : name}
        </h1>
      </div>
    );
  },
});


export default ParameterHandler;
