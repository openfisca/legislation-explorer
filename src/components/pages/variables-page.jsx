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
import React, {PropTypes} from "react/addons";

import AppPropTypes from "../../app-prop-types";


var VariablesPage = React.createClass({
  contextTypes: {
    router: PropTypes.func.isRequired,
  },
  propTypes: {
    variables: PropTypes.arrayOf(AppPropTypes.variable).isRequired,
  },
  getInitialState() {
    var {router} = this.context;
    var query = router.getCurrentQuery();
    return {
      fuzzy: this.guessBool(query.fuzzy),
      name: query.name,
      "search_in_description": this.guessBool(query.search_in_description),
      type: query.type,
    };
  },
  guessBool(value) {
    return ["true", "1"].includes(value);
  },
  handleFormSubmit(event) {
    event.preventDefault();
    var {router} = this.context;
    router.transitionTo("variables", null, this.state);
  },
  handleFuzzySearchChange(value) {
    this.setState({fuzzy: value});
  },
  handleNameFilterChange(newNameFilter) {
    this.setState({name: newNameFilter});
  },
  handleSearchInDescription(value) {
    this.setState({"search_in_description": value});
  },
  handleTypeFilterChange(newTypeFilter) {
    this.setState({type: newTypeFilter});
  },
  render() {
    return (
      <div>
        {this.renderSearchForm()}
      </div>
    );
  },
  renderSearchForm() {
    return (
      <form onSubmit={this.handleFormSubmit} role="search">
        <div className="input-group">
          <input
            className="form-control"
            name="name"
            onChange={(event) => this.handleNameFilterChange(event.target.value)}
            placeholder="Rechercher par nom de variable"
            type="search"
            value={this.state.name}
          />
          <span className="input-group-btn">
            <button
              className="btn btn-default"
              disabled={!this.state.name}
              onClick={() => this.handleNameFilterChange(null)}
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
                  checked={!this.state.type}
                  name="type"
                  onChange={() => this.handleTypeFilterChange(null)}
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
                  onChange={() => this.handleTypeFilterChange("input")}
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
                  onChange={() => this.handleTypeFilterChange("output")}
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
                  checked={this.state.search_in_description}
                  name="search_in_description"
                  onChange={(event) => this.handleSearchInDescription(event.target.checked)}
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
                  onChange={(event) => this.handleFuzzySearchChange(event.target.checked)}
                  type="checkbox"
                  value="true"
                />
                {" "}
                Recherche approximative
              </label>
            </div>
          </div>
        </div>
        <button
          className="btn btn-primary"
          type="submit"
        >
          Rechercher
        </button>
      </form>
    );
  },
  renderVariablesList(variables) {
    var applyFiltersReducer = (memo, variable) => {
      var {router} = this.context;
      var query = router.getCurrentQuery();
      if (
        (
          !query.name || (
            this.guessBool(query.fuzzy) ? (
              fuzzysearch(query.name.toLowerCase(), variable.name.toLowerCase()) || (
                this.guessBool(query.search_in_description) &&
                fuzzysearch(query.name.toLowerCase(), variable.label.toLowerCase())
              )
            ) : (
              variable.name.toLowerCase().includes(query.name.toLowerCase()) || (
                this.guessBool(query.search_in_description) &&
                variable.label.toLowerCase().includes(query.name.toLowerCase())
              )
            )
          )
        ) && (
          !query.type || query.type === "output" && !variable.is_input || query.type === "input" && variable.is_input
        )
      ) {
        memo.push(variable);
      }
      return memo;
    };
    return (
      <ul>
        {
          variables.reduce(applyFiltersReducer, []).map((variable, idx) =>
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
