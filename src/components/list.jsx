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


var List = React.createClass({
  propTypes: {
    children: PropTypes.func,
    keyProperty: PropTypes.string,
    type: PropTypes.string,
    items: PropTypes.array.isRequired,
  },
  render() {
    var {children, keyProperty, items, type} = this.props;
    return (
      <ul className={type ? `list-${type}` : null} style={{marginBottom: type === "inline" && 0}}>
        {
          items.map((item, idx) => (
            <li key={keyProperty ? item[keyProperty] : idx}>
              {children ? children(item, idx) : item}
              {type === "inline" && idx < items.length - 1 ? ", " : null}
            </li>
          ))
        }
      </ul>
    );
  },
});


export default List;
