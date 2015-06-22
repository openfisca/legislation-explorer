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
import Immutable from "immutable";
import React, {PropTypes} from "react";
import TextFilter from "react-text-filter";

import AppPropTypes from "../../app-prop-types";
import List from "../list";


var ParametersPage = React.createClass({
  propTypes: {
    parameters: PropTypes.arrayOf(AppPropTypes.parameterOrScale).isRequired,
  },
  filterParameters() {
    var {nameInput, parameterType, searchInDescription} = this.state;
    var nameFilter = nameInput && nameInput.length ? nameInput.trim().toLowerCase() : null;
    var isMatchingParameter = parameter => (
      !nameFilter ||
      parameter.get("name").toLowerCase().includes(nameFilter) ||
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
    const nameInput = "";
    const searchInDescription = false;
    const parameterType = "";
    return {nameInput, parameterType, searchInDescription};
  },
  handleNameChange(nameInput) {
    this.setState({nameInput});
  },
  handleParameterTypeChange(event) {
    const parameterType = event.target.value;
    this.setState({parameterType});
  },
  handleSearchInDescription(event) {
    const searchInDescription = event.target.checked;
    this.setState({searchInDescription});
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
        {parameter.description || "Aucune description"}
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
});


export default ParametersPage;
