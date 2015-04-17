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


import {Link} from "react-router";
import React, {PropTypes, PureRenderMixin} from "react/addons";
import url from "url";

import AppPropTypes from "../../prop-types";
import config from "../../config";


var VariablesPage = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    variables: PropTypes.arrayOf(AppPropTypes.variable).isRequired,
  },
  getInitialState: function() {
    return {
      nameFilter: null,
      typeFilter: "all",
    };
  },
  render() {
    return (
      <div>
        {this.renderBreadcrumb()}
        <div className="page-header">
          <h1>Variables et formules socio-fiscales</h1>
        </div>
        <p>
          {this.renderSearchForm()}
        </p>
        {this.renderVariablesList(this.props.variables)}
      </div>
    );
  },
  renderBreadcrumb() {
    return (
      <ul className="breadcrumb">
        <li>
          <a href={config.websiteUrl}>Accueil</a>
        </li>
        <li>
          <a href={url.resolve(config.websiteUrl, "/outils")}>Outils</a>
        </li>
        <li className="active">Explorateur de la législation</li>
      </ul>
    );
  },
  renderSearchForm() {
    return (
      <form role="search">
        <div className="input-group">
          <input
            className="form-control"
            onChange={(event) => this.setState({nameFilter: event.target.value})}
            placeholder="Rechercher par nom de variable"
            type="search"
            value={this.state.nameFilter}
          />
          <span className="input-group-btn">
            <button
              className="btn btn-default"
              disabled={this.state.nameFilter === null}
              onClick={() => this.setState({nameFilter: null})}
              type="button"
            >
              Effacer
            </button>
          </span>
        </div>
        <div className="radio">
          <label>
            <input
              checked={this.state.typeFilter === "all"}
              onChange={() => this.setState({typeFilter: "all"})}
              type="radio"
            />
            Toutes les variables
          </label>
        </div>
        <div className="radio">
          <label>
            <input
              checked={this.state.typeFilter === "input"}
              onChange={() => this.setState({typeFilter: "input"})}
              type="radio"
            />
            Variables d'entrée
          </label>
        </div>
        <div className="radio">
          <label>
            <input
              checked={this.state.typeFilter === "output"}
              onChange={() => this.setState({typeFilter: "output"})}
              type="radio"
            />
            Variables de sortie (avec formules)
          </label>
        </div>
      </form>
    );
  },
  renderVariablesList(variables) {
    var applyFilters = (memo, variable) => {
      var {nameFilter, typeFilter} = this.state;
      if (
        (
          !nameFilter || variable.name.includes(nameFilter)
        ) && (
          typeFilter === "all" ||
          typeFilter === "output" && !variable.is_input ||
          typeFilter === "input" && variable.is_input
        )
      ) {
        memo.push(variable);
      }
      return memo;
    };
    return (
      <ul>
        {
          variables.reduce(applyFilters, []).map((variable, idx) =>
            <li key={idx} style={{marginBottom: 10}}>
              <Link params={variable} to="variable">{variable.name}</Link>
              <br/>
              {variable.label ? variable.label : "Aucune description"}
            </li>
          )
        }
      </ul>
    );
  },
});


export default VariablesPage;
