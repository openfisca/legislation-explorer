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


import classNames from "classnames";
import React, {PropTypes} from "react";


var Collapse = React.createClass({
  propTypes: {
    children: PropTypes.node.isRequired,
    title: PropTypes.node.isRequired,
  },
  getInitialState() {
    return {
      opened: false,
    };
  },
  handleTitleClick(event) {
    event.preventDefault();
    const {opened} = this.state;
    this.setState({opened: !opened});
  },
  render() {
    const {children, title} = this.props;
    const {opened} = this.state;
    return (
      <div>
        <div style={{marginBottom: "2em"}}>
          <a href="#" onClick={this.handleTitleClick}>
            <span
              aria-hidden="true"
              className={classNames("glyphicon", opened ? "glyphicon-triangle-bottom" : "glyphicon-triangle-right")}
              style={{display: "inline-block", marginRight: "0.5em"}}
            ></span>
            {React.cloneElement(title, {style: {display: "inline-block"}})}
          </a>
        </div>
        {opened && children}
      </div>
    );
  },
});


export default Collapse;
