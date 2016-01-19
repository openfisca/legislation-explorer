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
    lineNumber: PropTypes.number,
    style: PropTypes.object,
    text: PropTypes.string,
    title: PropTypes.string,
  },
  buildHref() {
    const {blobUrlPath, commitReference, endLineNumber, lineNumber} = this.props;
    var line = "";
    if (lineNumber) {
      line = `#L${lineNumber}`;
    }
    if (endLineNumber) {
      line = `${line}-L${endLineNumber}`;
    }
    return `https://github.com/openfisca/openfisca-france/blob/${commitReference}/${blobUrlPath}${line}`;
  },
  getDefaultProps() {
    return {
      commitReference: "master",
      text: "GitHub",
      title: "Voir le fichier source sur GitHub",
    };
  },
  render() {
    const {text, title} = this.props;
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
