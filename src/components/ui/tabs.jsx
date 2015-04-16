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



var Tabs = React.createClass({
  propTypes: {
    panes: PropTypes.arrayOf(PropTypes.shape({
      element: PropTypes.element.isRequired,
      title: PropTypes.string.isRequired,
    })).isRequired,
  },
  render() {
    return (
      <div role="tabpanel">
        <ul className="nav nav-tabs" role="tablist">
          {
            this.props.panes.map((pane, idx) =>
              <li className={classNames(idx === 0 && "active")} key={idx} role="presentation">
                <a aria-controls={idx} data-toggle="tab" href={`#${idx}`} role="tab">
                  {pane.title}
                </a>
              </li>
            )
          }
        </ul>
        <div className="tab-content">
          {
            this.props.panes.map((pane, idx) =>
              <div className={classNames("tab-pane", idx === 0 && "active")} id={idx} key={idx} role="tabpanel">
                {pane.element}
              </div>
            )
          }
        </div>
      </div>
    );
  },
});


export default Tabs;
