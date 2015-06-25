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


import DocumentTitle from "react-document-title";
import React, {Component, PropTypes} from "react";


class HtmlDocument extends Component {
  static propTypes = {
    appHtml: PropTypes.string.isRequired,
    css: PropTypes.arrayOf(PropTypes.string),
    scripts: PropTypes.arrayOf(PropTypes.string),
  }
  static defaultProps = {
    css: [],
    script: [],
  }
  render() {
    const {appHtml, css, scripts} = this.props;
    return (
      <html>
        <head>
          <meta content="width=device-width, initial-scale=1.0, user-scalable=no" name="viewport" />
          <title>{DocumentTitle.rewind()}</title>
          {css.map((href, k) => <link href={href} key={k} rel="stylesheet" type="text/css" />)}
        </head>
        <body>
          <div dangerouslySetInnerHTML={{__html: appHtml}} id="app-mount-node" />
          {scripts.map((src, idx) => <script key={idx} src={src} />)}
        </body>
      </html>
    );
  }
}

export default HtmlDocument;
