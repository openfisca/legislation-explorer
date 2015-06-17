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
import Immutable from "immutable";
import React, {PropTypes} from "react";

import AppPropTypes from "../../app-prop-types";
import VariablesTree from "./variables-tree";


// const debug = require("debug")("app:VariablesPage");


var VariablesPage = React.createClass({
  propTypes: {
    variables: PropTypes.arrayOf(AppPropTypes.variable).isRequired,
  },
  buildVariablesTree(variables) {
    return Immutable.fromJS(variables)
      .sortBy(variable => variable.get("name"))
      .reduce(
        (reduction, variable) => reduction.updateIn(
          Immutable.List(variable.get("module").split(".")).interpose("children").unshift("children"),
          Immutable.Map(),
          node => node.update("variables", Immutable.List(), nodeVariables => nodeVariables.push(variable))
        ),
        Immutable.Map({opened: true})
      );
  },
  filterVariablesTree(variablesTreeRoot, formulaType, nameInput, searchInDescription, variableType) {
    var nameFilter = nameInput && nameInput.length ? nameInput.trim().toLowerCase() : null;
    var walk = variablesTree => {
      var isMatchingVariable = variable => (
        !nameFilter ||
        variable.get("name").toLowerCase().includes(nameFilter) ||
        searchInDescription && variable.get("label").toLowerCase().includes(nameFilter)
      ) && (
        formulaType === "" ||
        formulaType === variable.getIn(["formula", "@type"])
      ) && (
        variableType === "" ||
        variableType === "formula" && variable.get("formula") ||
        variableType === "input" && !variable.get("formula")
      );
      if (variablesTree.has("children")) {
        var newChildren = variablesTree.get("children").map(child => walk(child));
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
    };
    return walk(variablesTreeRoot);
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
    const nameInput = "";
    const searchInDescription = false;
    const formulaType = "";
    const variableType = "";
    var variablesTree = this.buildVariablesTree(this.props.variables);
    variablesTree = this.filterVariablesTree(variablesTree, formulaType, nameInput, searchInDescription, variableType);
    return {formulaType, nameInput, searchInDescription, variableType, variablesTree};
  },
  handleCursorUpdate(newVariablesTree) {
    this.setState({variablesTree: newVariablesTree});
  },
  handleNameChange(event) {
    const nameInput = event.target.value;
    const {formulaType, searchInDescription, variablesTree, variableType} = this.state;
    this.setState({
      nameInput,
      variablesTree: this.filterVariablesTree(variablesTree, formulaType, nameInput, searchInDescription, variableType),
    });
  },
  handleFormulaTypeChange(event) {
    const formulaType = event.target.value;
    const {nameInput, searchInDescription, variablesTree, variableType} = this.state;
    this.setState({
      formulaType,
      variablesTree: this.filterVariablesTree(variablesTree, formulaType, nameInput, searchInDescription, variableType),
    });
  },
  handleNameClear() {
    const nameInput = "";
    const {formulaType, searchInDescription, variablesTree, variableType} = this.state;
    this.setState({
      nameInput,
      variablesTree: this.filterVariablesTree(variablesTree, formulaType, nameInput, searchInDescription, variableType),
    });
  },
  handleSearchInDescription(event) {
    const searchInDescription = event.target.checked;
    const {formulaType, nameInput, variablesTree, variableType} = this.state;
    this.setState({
      searchInDescription,
      variablesTree: this.filterVariablesTree(variablesTree, formulaType, nameInput, searchInDescription, variableType),
    });
  },
  handleVariablesTreeCloseAll() {
    var newVariablesTree = this.forceOpenCloseAll(this.state.variablesTree, {opened: false});
    this.setState({variablesTree: newVariablesTree});
  },
  handleVariablesTreeOpenAll() {
    var newVariablesTree = this.forceOpenCloseAll(this.state.variablesTree, {opened: true});
    this.setState({variablesTree: newVariablesTree});
  },
  handleVariableTypeChange(event) {
    const variableType = event.target.value;
    const {formulaType, nameInput, searchInDescription, variablesTree} = this.state;
    this.setState({
      variableType,
      variablesTree: this.filterVariablesTree(variablesTree, formulaType, nameInput, searchInDescription, variableType),
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
      <form onSubmit={event => event.preventDefault()} role="search">
        <div className="input-group">
          <input
            className="form-control"
            name="name"
            onChange={this.handleNameChange}
            placeholder="Rechercher par nom de variable"
            type="search"
            value={this.state.nameInput}
          />
          <span className="input-group-btn">
            <button
              className="btn btn-default"
              disabled={!this.state.nameInput}
              onClick={this.handleNameClear}
              type="button"
            >
              Effacer
            </button>
          </span>
        </div>
        <div className="row">
          <div className="col-sm-4">
            <div className="radio">
              <label>
                <input
                  checked={this.state.variableType === ""}
                  name="variableType"
                  onChange={this.handleVariableTypeChange}
                  type="radio"
                  value=""
                />
                Toutes les variables
              </label>
            </div>
            <div className="radio">
              <label>
                <input
                  checked={this.state.variableType === "input"}
                  name="variableType"
                  onChange={this.handleVariableTypeChange}
                  type="radio"
                  value="input"
                />
                Variables d'entrée
              </label>
            </div>
            <div className="radio">
              <label>
                <input
                  checked={this.state.variableType === "formula"}
                  name="variableType"
                  onChange={this.handleVariableTypeChange}
                  type="radio"
                  value="formula"
                />
                Variables calculées
              </label>
            </div>
          </div>
          {
            this.state.variableType === "formula" && (
              <div className="col-sm-4">
                <div className="radio">
                  <label>
                    <input
                      checked={this.state.formulaType === ""}
                      name="formulaType"
                      onChange={this.handleFormulaTypeChange}
                      type="radio"
                      value=""
                    />
                    Toutes les formules
                  </label>
                </div>
                <div className="radio">
                  <label>
                    <input
                      checked={this.state.formulaType === "SimpleFormula"}
                      name="formulaType"
                      onChange={this.handleFormulaTypeChange}
                      type="radio"
                      value="SimpleFormula"
                    />
                    Formules simples
                  </label>
                </div>
                <div className="radio">
                  <label>
                    <input
                      checked={this.state.formulaType === "DatedFormula"}
                      name="formulaType"
                      onChange={this.handleFormulaTypeChange}
                      type="radio"
                      value="DatedFormula"
                    />
                    Formules datées
                  </label>
                </div>
                <div className="radio">
                  <label>
                    <input
                    checked={this.state.formulaType === "PersonToEntity"}
                      name="formulaType"
                      onChange={this.handleFormulaTypeChange}
                      type="radio"
                      value="PersonToEntity"
                    />
                    Personne vers entité
                  </label>
                </div>
                <div className="radio">
                  <label>
                    <input
                      checked={this.state.formulaType === "EntityToPerson"}
                      name="formulaType"
                      onChange={this.handleFormulaTypeChange}
                      type="radio"
                      value="EntityToPerson"
                    />
                    Entité vers personne
                  </label>
                </div>
              </div>
            )
          }
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
