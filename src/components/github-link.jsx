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


import React, {PropTypes} from "react/addons";


var GitHubLink = React.createClass({
  propTypes: {
    blobUrlPath: PropTypes.string,
    children: PropTypes.element,
    commitReference: PropTypes.string,
    external: PropTypes.bool,
    lastLineNumber: PropTypes.number,
    lineNumber: PropTypes.number,
    style: PropTypes.object,
  },
  buildHref() {
    var line = "";
    if (this.props.lineNumber) {
      line = `#L${this.props.lineNumber}`;
    }
    if (this.props.lastLineNumber) {
      line = `${line}-${this.props.lastLineNumber}`;
    }
    var {blobUrlPath, commitReference} = this.props;
    return `https://github.com/openfisca/openfisca-france/blob/${commitReference}/${blobUrlPath}${line}`;
  },
  getDefaultProps() {
    return {
      commitReference: "master",
      external: true,
    };
  },
  render() {
    var externalProps = this.props.external ? {
      rel: "external",
      target: "_blank",
    } : {};
    return (
      <a {...externalProps} href={this.buildHref()} style={this.props.style}>
        {this.props.children ? this.renderPropsChildren() : this.renderDefaultChildren()}
      </a>
    );
  },
  renderDefaultChildren() {
    return React.addons.createFragment({
      glyphicon: this.props.external && <span aria-hidden="true" className="glyphicon glyphicon-new-window"></span>,
      space: this.props.external && " ",
      text: "GitHub",
    });
  },
  renderPropsChildren() {
    return React.cloneElement(this.props.children, null, this.renderDefaultChildren());
  },
});


export default GitHubLink;
