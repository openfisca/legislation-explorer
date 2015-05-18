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


import Cursor from "immutable/contrib/cursor";
import React from "react/addons";

import AppPropTypes from "../../app-prop-types";
import VariablesTree from "./variables-tree";


// const debug = require("debug")("app:VariablesPage");


var VariablesPage = React.createClass({
  propTypes: {
    variablesTree: AppPropTypes.immutableVariablesTree.isRequired,
  },
  filterVariablesTree(variablesTree, nameFilter) {
    var isMatchingVariable = variable => !nameFilter || variable.get("name").toLowerCase().includes(nameFilter);
    if (variablesTree.has("children")) {
      var newChildren = variablesTree.get("children").map(child => this.filterVariablesTree(child, nameFilter));
      return variablesTree.merge({
        children: newChildren,
        hasMatchingVariables: newChildren.some(node => node.get("hasMatchingVariables")),
      });
    } else {
      var newVariables = variablesTree.get("variables").map(
        variable => variable.set("matches", isMatchingVariable(variable))
      );
      return variablesTree.merge({
        hasMatchingVariables: newVariables.some(variable => variable.get("matches")),
        variables: newVariables,
      });
    }
  },
  forceOpenCloseAll(variablesTree, newEntries) {
    var newVariablesTree = variablesTree.merge(newEntries);
    if (variablesTree.has("children")) {
      var newChildren = newVariablesTree.get("children").map(child => this.forceOpenCloseAll(child, newEntries));
      newVariablesTree = newVariablesTree.set("children", newChildren);
    }
    return newVariablesTree;
  },
  getInitialState() {
    return {
      nameFilter: "",
      searchInDescription: false,
      type: "",
      variablesTree: this.filterVariablesTree(this.props.variablesTree),
    };
  },
  handleCursorUpdate(newData) {
    this.setState({variablesTree: newData});
  },
  handleNameChange(event) {
    var nameFilter = event.target.value;
    var cleanNameFilter = nameFilter && nameFilter.length ? nameFilter.trim().toLowerCase() : "";
    var {variablesTree} = this.state;
    var filteredVariablesTree = this.filterVariablesTree(variablesTree, cleanNameFilter);
    this.setState({nameFilter, variablesTree: filteredVariablesTree});
  },
  handleNameClear() {
    this.setState({nameFilter: ""});
  },
  handleSearchInDescription(event) {
    this.setState({searchInDescription: event.target.checked});
  },
  handleTypeChange(event) {
    this.setState({type: event.target.value});
  },
  handleVariablesTreeCloseAll() {
    var newVariablesTree = this.forceOpenCloseAll(this.state.variablesTree, {opened: false});
    this.setState({variablesTree: newVariablesTree});
  },
  handleVariablesTreeOpenAll() {
    var newVariablesTree = this.forceOpenCloseAll(this.state.variablesTree, {opened: true});
    this.setState({variablesTree: newVariablesTree});
  },
  render() {
    return (
      <div>
        {this.renderSearchForm()}
        <hr />
        {this.renderVariablesTree()}
      </div>
    );
  },
  renderSearchForm() {
    return (
      <form onSubmit={event => event.preventDefault()} role="search">
        <div className="input-group">
          <input
            className="form-control"
            name="name"
            onChange={this.handleNameChange}
            placeholder="Rechercher par nom de variable"
            type="search"
            value={this.state.nameFilter}
          />
          <span className="input-group-btn">
            <button
              className="btn btn-default"
              disabled={!this.state.nameFilter}
              onClick={this.handleNameClear}
              type="button"
            >
              Effacer
            </button>
          </span>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <div className="radio">
              <label>
                <input
                  checked={this.state.type === ""}
                  name="type"
                  onChange={this.handleTypeChange}
                  type="radio"
                  value=""
                />
                Toutes les variables
              </label>
            </div>
            <div className="radio">
              <label>
                <input
                  checked={this.state.type === "input"}
                  name="type"
                  onChange={this.handleTypeChange}
                  type="radio"
                  value="input"
                />
                Variables d'entrée
              </label>
            </div>
            <div className="radio">
              <label>
                <input
                  checked={this.state.type === "output"}
                  name="type"
                  onChange={this.handleTypeChange}
                  type="radio"
                  value="output"
                />
                Variables de sortie (avec formules)
              </label>
            </div>
          </div>
          <div className="col-sm-6">
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
        </div>
      </form>
    );
  },
  renderVariablesTree() {
    return (
      <div>
        <div style={{marginBottom: 10, marginTop: 10}}>
          <button
            className="btn btn-default"
            onClick={this.handleVariablesTreeOpenAll}
            style={{marginRight: 10}}
          >
            Tout ouvrir
          </button>
          <button className="btn btn-default" onClick={this.handleVariablesTreeCloseAll}>
            Tout fermer
          </button>
        </div>
        <VariablesTree cursor={Cursor.from(this.state.variablesTree, this.handleCursorUpdate)} />
      </div>
    );
  },
});


export default VariablesPage;
