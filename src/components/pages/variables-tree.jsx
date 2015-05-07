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
import classNames from "classnames";
import React, {PropTypes} from "react/addons";

import AppPropTypes from "../../app-prop-types";


// const debug = require("debug")("app:VariablesTree");


var VariablesTree = React.createClass({
  propTypes: {
    children: PropTypes.objectOf(AppPropTypes.variablesTree),
    onChildToggle: PropTypes.func,
    path: PropTypes.arrayOf(PropTypes.string),
    variables: PropTypes.arrayOf(AppPropTypes.variable),
  },
  handleChildClick(event, childName) {
    event.preventDefault();
    var childPath = (this.props.path || []).concat(childName);
    this.props.onChildToggle(childPath);
  },
  render() {
    return (
      <div>
        {
          this.props.children && Object.keys(this.props.children).map(
            (childName, idx) => <div key={idx}>{this.renderChild(childName, this.props.children[childName])}</div>
          )
        }
        {
          this.props.variables && (
            <ul style={{paddingLeft: 20}}>
              {
                this.props.variables.map((variable, idx) => (
                  <li key={idx} style={{marginBottom: 10}}>
                    <Link params={variable} to="variable">{variable.name}</Link>
                    {" : "}
                    {variable.label || "Aucune description"}
                    <br/>
                    {
                      variable.input_variables && variable.input_variables.length && (
                        <div className="clearfix">
                          <span className="pull-left">Dépend de </span>
                          <ul className="list-inline">
                            {
                              variable.input_variables.map((variableName, variableNameIdx) => (
                                <li key={variableNameIdx}>
                                  <Link params={{name: variableName}} to="variable">
                                    {variableName}
                                  </Link>
                                </li>
                              ))
                            }
                          </ul>
                        </div>
                      )
                    }
                  </li>
                ))
              }
            </ul>
          )
        }
      </div>
    );
  },
  renderChild(childName, child) {
    var isOpened = child.opened || typeof child.opened === "undefined";
    return (
      <div>
        <a href="#" onClick={event => this.handleChildClick(event, childName)}>
          <span
            aria-hidden="true"
            className={
              classNames("glyphicon", isOpened ? "glyphicon-chevron-down" : "glyphicon-chevron-right")
            }
          ></span>
          {" "}
          {childName}
        </a>
        {
          isOpened && (
            <div style={{marginLeft: 20}}>
              <VariablesTree
                children={child.children}
                onChildToggle={this.props.onChildToggle}
                path={(this.props.path || []).concat(childName)}
                variables={child.variables}
              />
            </div>
          )
        }
      </div>
    );
  },
});


export default VariablesTree;
