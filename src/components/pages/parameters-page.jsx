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
import {Navigation, State} from "react-router";
import Immutable from "immutable";
import React, {PropTypes} from "react";
import TextFilter from "react-text-filter";

import {withoutAccents} from "../../accents";
import AppPropTypes from "../../app-prop-types";
import List from "../list";


var ParametersPage = React.createClass({
  mixins: [Navigation, State],
  propTypes: {
    parameters: PropTypes.arrayOf(AppPropTypes.parameterOrScale).isRequired,
  },
  filterParameters() {
    const {nameInput, parameterType, searchInDescription} = this.state;
    const nameFilter = nameInput && nameInput.length ? nameInput.trim().toLowerCase() : null;
    const isMatchingParameter = (parameter) => (
      !nameFilter ||
      parameter.get("name").toLowerCase().includes(nameFilter) ||
      parameter.get("name").toLowerCase().replace(/_/g, " ").includes(withoutAccents(nameFilter)) ||
      searchInDescription && parameter.get("description") &&
        parameter.get("description").toLowerCase().includes(nameFilter)
    ) && (
      parameterType === "" ||
      parameterType === parameter.get("@type")
    );
    return Immutable.fromJS(this.props.parameters)
      .filter(isMatchingParameter)
      .sortBy(parameter => parameter.get("name"))
      .toJS();
  },
  getInitialState() {
    const emptyValuesState = {
      nameInput: "",
      parameterType: "",
      searchInDescription: "",
    };
    const queryState = this.getStateFromQuery();
    const initialState = Object.assign({}, emptyValuesState, queryState);
    return initialState;
  },
  getQueryFromState() {
    const {nameInput, parameterType, searchInDescription} = this.state;
    let query = {};
    if (nameInput) {
      query.name = nameInput;
    }
    if (parameterType) {
      query.parameter_type = parameterType;
    }
    if (searchInDescription) {
      query.search_in_description = searchInDescription;
    }
    return query;
  },
  getStateFromQuery() {
    const toBoolean = (str) => /^true|t|yes|y|1$/i.test(str);
    const {name, parameter_type, search_in_description} = this.getQuery();
    return {
      nameInput: name || "",
      parameterType: parameter_type || "",
      searchInDescription: toBoolean(search_in_description),
    };
  },
  handleNameChange(nameInput) {
    this.setState({nameInput}, this.updateQueryFromState);
  },
  handleParameterTypeChange(event) {
    const parameterType = event.target.value;
    this.setState({parameterType}, this.updateQueryFromState);
  },
  handleSearchInDescription(event) {
    const searchInDescription = event.target.checked;
    this.setState({searchInDescription}, this.updateQueryFromState);
  },
  render() {
    return (
      <div>
        {this.renderSearchForm()}
        <hr />
        {this.renderParameters()}
      </div>
    );
  },
  renderParameter(parameter) {
    return (
      <span>
        <Link params={parameter} to="parameter">{parameter.name}</Link>
        {" : "}
        {parameter.description}
      </span>
    );
  },
  renderParameters() {
    const filteredParameters = this.filterParameters();
    return (
      <List items={filteredParameters} keyProperty="name">
        {this.renderParameter}
      </List>
    );
  },
  renderSearchForm() {
    return (
      <form onSubmit={event => event.preventDefault()} role="search">
        <TextFilter
          className="form-control"
          debounceTimeout={500}
          filter={this.state.nameInput}
          minLength={1}
          name="name"
          onFilter={this.handleNameChange}
          placeholder="Rechercher par nom de paramètre"
          type="search"
        />
        <div className="row">
          <div className="col-sm-4">
            <div className="checkbox">
              <label>
                <input
                  checked={this.state.searchInDescription}
                  name="search_in_description"
                  onChange={this.handleSearchInDescription}
                  type="checkbox"
                  value="true"
                />
                {" "}
                Rechercher aussi dans la description
              </label>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="radio">
              <label>
                <input
                  checked={this.state.parameterType === ""}
                  name="parameterType"
                  onChange={this.handleParameterTypeChange}
                  type="radio"
                  value=""
                />
                Toutes les paramètres
              </label>
            </div>
            <div className="radio">
              <label>
                <input
                  checked={this.state.parameterType === "Parameter"}
                  name="parameterType"
                  onChange={this.handleParameterTypeChange}
                  type="radio"
                  value="Parameter"
                />
                Paramètres simples
              </label>
            </div>
            <div className="radio">
              <label>
                <input
                  checked={this.state.parameterType === "Scale"}
                  name="parameterType"
                  onChange={this.handleParameterTypeChange}
                  type="radio"
                  value="Scale"
                />
                Barèmes
              </label>
            </div>
          </div>
        </div>
      </form>
    );
  },
  updateQueryFromState() {
    // Browser only method.
    const query = this.getQuery();
    const permanentQuery = {api_url: query.api_url};
    const stateQuery = this.getQueryFromState();
    const newQuery = Object.assign({}, permanentQuery, stateQuery);
    const path = this.makePath(this.getPathname(), this.getParams(), newQuery);
    window.history.replaceState({path}, "", path);
  },
});


export default ParametersPage;
