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


import React, {PropTypes} from "react";

import ExternalLink from "./external-link";


var GitHubLink = React.createClass({
  propTypes: {
    blobUrlPath: PropTypes.string,
    children: PropTypes.func,
    className: PropTypes.string,
    commitReference: PropTypes.string,
    endLineNumber: PropTypes.number,
    external: PropTypes.bool,
    lineNumber: PropTypes.number,
    style: PropTypes.object,
    text: PropTypes.string,
    title: PropTypes.string,
  },
  buildHref() {
    var line = "";
    if (this.props.lineNumber) {
      line = `#L${this.props.lineNumber}`;
    }
    if (this.props.endLineNumber) {
      line = `${line}-${this.props.endLineNumber}`;
    }
    const {blobUrlPath, commitReference} = this.props;
    return `https://github.com/openfisca/openfisca-france/blob/${commitReference}/${blobUrlPath}${line}`;
  },
  getDefaultProps() {
    return {
      commitReference: "master",
      external: true,
      text: "GitHub",
      title: "Voir le fichier source sur GitHub",
    };
  },
  render() {
    const {external, text, title} = this.props;
    return (
      <ExternalLink
        className={this.props.className}
        href={this.buildHref()}
        style={this.props.style}
        title={title}
      >
        {this.props.children ? this.props.children(text) : text}
      </ExternalLink>
    );
  },
});


export default GitHubLink;
