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


import fuzzysearch from "fuzzysearch";
import Immutable from "immutable";
import React, {PropTypes} from "react/addons";

import AppPropTypes from "../../app-prop-types";
import VariablesTree from "./variables-tree";


// const debug = require("debug")("app:VariablesPage");


var VariablesPage = React.createClass({
  propTypes: {
    variables: PropTypes.arrayOf(AppPropTypes.variable).isRequired,
  },
  buildVariablesTreeData(variables) {
    var data = Immutable.fromJS(variables)
      .reduce(
        (reduction, variable) => reduction.updateIn(
          variable.get("modulePath").interpose("children").unshift("children"),
          new Immutable.Map(),
          node => node.update("variables", new Immutable.List(), nodeVariables => nodeVariables.push(variable))
        ),
        new Immutable.Map({opened: true})
      );
    Object.keys(this.state.closedByPath).forEach(pathStr => {
      var isOpened = !this.state.closedByPath[pathStr];
      var path = Immutable.fromJS(pathStr.split(".")).interpose("children").unshift("children").toJS();
      data = data.setIn(path.concat("opened"), isOpened);
    });
    return data;
  },
  findVariables() {
    var name = this.state.name && this.state.name.length ? this.state.name.trim().toLowerCase() : "";
    var applyFiltersReducer = (memo, variable) => {
      if (
        (
          !name || (
            this.state.fuzzy ? (
              fuzzysearch(name, variable.name.toLowerCase()) || (
                this.state.searchInDescription && fuzzysearch(name, variable.label.toLowerCase())
              )
            ) : (
              variable.name.toLowerCase().includes(name) || (
                this.state.searchInDescription && variable.label.toLowerCase().includes(name)
              )
            )
          )
        ) && (
          this.state.type === "" ||
          // TODO Replace is_input with variable.formula?
          this.state.type === "output" && !variable.is_input ||
          this.state.type === "input" && variable.is_input
        )
      ) {
        memo.push(variable);
      }
      return memo;
    };
    return this.props.variables.reduce(applyFiltersReducer, []);
  },
  getInitialState() {
    return {
      closeAll: false,
      closedByPath: {},
      fuzzy: false,
      name: "",
      searchInDescription: false,
      type: "",
    };
  },
  handleChildToggle(path) {
    var newClosedByPath = Immutable.fromJS(this.state.closedByPath)
      .set(path, !this.state.closedByPath[path]).toJS();
    this.setState({
      closeAll: false,
      closedByPath: newClosedByPath,
    });
  },
  handleFuzzySearchChange(event) {
    this.setState({fuzzy: event.target.checked});
  },
  handleNameChange(event) {
    this.setState({name: event.target.value});
  },
  handleNameClear() {
    this.setState({name: null});
  },
  handleSearchInDescription(event) {
    this.setState({searchInDescription: event.target.checked});
  },
  handleTypeChange(event) {
    this.setState({type: event.target.value});
  },
  handleVariablesTreeCloseAll() {
    this.setState({
      closeAll: true,
      closedByPath: {"openfisca_france": true},
    });
  },
  handleVariablesTreeOpenAll() {
    this.setState({
      closeAll: false,
      closedByPath: {},
    });
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
      <form role="search">
        <div className="input-group">
          <input
            className="form-control"
            name="name"
            onChange={this.handleNameChange}
            placeholder="Rechercher par nom de variable"
            type="search"
            value={this.state.name}
          />
          <span className="input-group-btn">
            <button
              className="btn btn-default"
              disabled={!this.state.name}
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
            <div className="checkbox">
              <label>
                <input
                  checked={this.state.fuzzy}
                  name="fuzzy"
                  onChange={this.handleFuzzySearchChange}
                  type="checkbox"
                  value="true"
                />
                {" "}
                Recherche approximative
              </label>
            </div>
          </div>
        </div>
      </form>
    );
  },
  renderVariablesTree() {
    var foundVariables = this.findVariables();
    var variablesTreeData = this.buildVariablesTreeData(foundVariables);
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
        <VariablesTree
          children={variablesTreeData.get("children")}
          onChildToggle={this.handleChildToggle}
          variables={variablesTreeData.get("variables")}
        />
      </div>
    );
  },
});


export default VariablesPage;
