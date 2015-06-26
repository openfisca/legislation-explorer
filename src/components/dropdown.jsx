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


var Dropdown = React.createClass({
  propTypes: {
    className: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({
      disabled: PropTypes.bool,
      onSelect: PropTypes.func.isRequired,
      text: PropTypes.string.isRequired,
      title: PropTypes.string,
    })).isRequired,
  },
  getInitialState() {
    return {
      opened: false,
    };
  },
  handleBackgroundClick(event) {
    event.preventDefault();
    this.setState({opened: false});
  },
  handleDropdownClick() {
    const {opened} = this.state;
    this.setState({opened: !opened});
  },
  handleOtherItemClick(event, item) {
    event.preventDefault();
    if (!item.disabled) {
      this.setState({opened: false}, item.onSelect);
    }
  },
  render() {
    const {opened} = this.state;
    const {className, items} = this.props;
    const [firstItem, ...otherItems] = items;
    return (
      <span className={classNames(className, opened && "open")}>
        <button
          className="btn btn-default"
          onClick={firstItem.onSelect}
          title={firstItem.title}
          type="button"
        >
          {firstItem.text}
        </button>
        {
          otherItems.length && (
            <button
              aria-expanded={opened}
              aria-haspopup
              className="btn btn-default dropdown-toggle"
              onClick={this.handleDropdownClick}
              type="button"
            >
              <span className="caret"></span>
              <span className="sr-only">Toggle Dropdown</span>
            </button>
          )
        }
        {
          (otherItems.length && opened) && (
            <a href="#" onClick={this.handleBackgroundClick} style={{
              bottom: 0,
              left: 0,
              position: "fixed",
              right: 0,
              top: 0,
              zIndex: 1,
            }}></a>
          )
        }
        {
          otherItems.length && (
            <ul className="dropdown-menu dropdown-menu-right">
              {
                otherItems.map((item, idx) => (
                  <li className={classNames(item.disabled && "disabled")} key={idx}>
                    <a
                      href="#"
                      onClick={event => this.handleOtherItemClick(event, item)}
                      style={{zIndex: opened ? 2 : null}}
                      title={item.title}
                    >
                      {item.text}
                    </a>
                  </li>
                ))
              }
            </ul>
          )
        }
      </span>
    );
  },
});


export default Dropdown;
