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
import ImmutableRenderMixin from "react-immutable-render-mixin";
import React, {PropTypes} from "react";

import GitHubLink from "../github-link";


// const debug = require("debug")("app:VariablesTree");


var VariablesTree = React.createClass({
  mixins: [ImmutableRenderMixin],
  propTypes: {
    countryPackageGitHeadSha: PropTypes.string.isRequired,
    cursor: PropTypes.object.isRequired,
  },
  handleChildClick(event, childName) {
    event.preventDefault();
    var {cursor} = this.props;
    var openedPath = ["children", childName, "opened"];
    cursor.updateIn(openedPath, opened => !(opened || typeof opened === "undefined"));
  },
  render() {
    var {cursor} = this.props;
    var children = cursor.get("children");
    var variables = cursor.get("variables");
    return (
      <div>
        {
          children && children.mapEntries(
            (kv, idx) => [kv[0], this.renderChild(kv[0], kv[1], idx)]
          ).toArray()
        }
        {
          variables && (
            <ul style={{margin: 0, paddingLeft: 20}}>
              {
                variables.map(
                  (variable, idx) => this.renderVariableListItem(variable.toJS(), idx)
                ).toArray()
              }
            </ul>
          )
        }
      </div>
    );
  },
  renderChild(childName, child, idx) {
    var isOpened = child.get("opened") || typeof child.get("opened") === "undefined";
    return (
      <div className={classNames({hide: !child.get("hasMatchingVariables")})} key={idx}>
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
        <div className={classNames({hide: !isOpened})} style={{marginLeft: 20}}>
          <VariablesTree
            countryPackageGitHeadSha={this.props.countryPackageGitHeadSha}
            cursor={this.props.cursor.cursor(["children", childName])}
          />
        </div>
      </div>
    );
  },
  renderVariableListItem(variable, idx) {
    const {countryPackageGitHeadSha} = this.props;
    const {label, line_number, matches, module, name} = variable;
    return (
      <li className={classNames({hide: !matches})} key={idx}>
        <Link params={variable} to="variable">{name}</Link>
        {" : "}
        {
          label && label !== name ?
            label : (
              <GitHubLink
                blobUrlPath={`${module.split(".").join("/")}.py`}
                className="label label-warning"
                commitReference={countryPackageGitHeadSha}
                lineNumber={line_number}
                style={{marginLeft: "1em"}}
                text="Aucun libellé"
                title="Ajouter un libellé via GitHub"
              />
            )
        }
      </li>
    );
  },
});


export default VariablesTree;
