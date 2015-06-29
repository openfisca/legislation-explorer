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
import React, {PropTypes} from "react";


var FormulaSource = React.createClass({
  propTypes: {
    children: PropTypes.string.isRequired,
    inputVariables: PropTypes.arrayOf(PropTypes.string),
  },
  getSourceFragments(source, inputVariables) {
    return inputVariables.reduce((memo, inputVariable) => {
      var idx = 0;
      return memo.reduce((fragmentMemo, fragment) => {
        if (fragment.source) {
          const inputVariableFragments = this.getSourceFragmentsForInputVariable(fragment.source, inputVariable);
          if (inputVariableFragments.length) {
            fragmentMemo.splice(idx, 1, ...inputVariableFragments);
          }
        }
        idx += 1;
        return fragmentMemo;
      }, memo);
    }, [{source}]);
  },
  getSourceFragmentsForInputVariable(source, inputVariable) {
    const regexp = new RegExp(`['"](${inputVariable})['"]`, "g");
    var match;
    var fragments = [];
    while ((match = regexp.exec(source)) !== null) {
      const index = match.index + 1;
      fragments = fragments.concat([
        {source: source.slice(0, index)},
        {inputVariable: source.slice(index, index + inputVariable.length)},
        {source: source.slice(index + inputVariable.length)},
      ]);
    }
    return fragments;
  },
  getSourceWithLinks(source, inputVariables) {
    const sourceFragments = this.getSourceFragments(source, inputVariables);
    return (
      <div>
        {
          sourceFragments.map((fragment, idx) => fragment.source ? (
            <span key={idx}>{fragment.source}</span>
          ) : fragment.inputVariable ? (
            <Link key={idx} params={{name: fragment.inputVariable}} to="variable">
              <span
                aria-hidden="true"
                className="glyphicon glyphicon-link"
                style={{
                  color: "#2aa198", // Same color than Highlight.js variables.
                  marginRight: "0.3em",
                }}
              />
              <strong>{fragment.inputVariable}</strong>
            </Link>
          ) : null)
        }
      </div>
    );
  },
  render() {
    const {inputVariables} = this.props;
    const source = this.props.children;
    return (
      <div style={{
        fontFamily: "monospace",
        fontSize: 12,
        overflowWrap: "normal",
        whiteSpace: "pre",
      }}>
        {this.getSourceWithLinks(source, inputVariables)}
      </div>
    );
  },
});


export default FormulaSource;
