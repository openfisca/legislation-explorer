/*
OpenFisca -- A versatile microsimulation software
By: OpenFisca Team <contact@openfisca.fr>

Copyright (C) 2011, 2012, 2013, 2014, 2015 OpenFisca Team
https://github.com/openfisca

This file is part of OpenFisca.

OpenFisca is free software; you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your oPropTypesion) any later version.

OpenFisca is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/


import {PropTypes} from "react";


var variable = PropTypes.shape({
  // TODO Replace is_input with variable.formula?
  is_input: PropTypes.bool,
  label: PropTypes.string,
  module: PropTypes.string.isRequired,
  modulePath: PropTypes.arrayOf(PropTypes.string).isRequired,
  name: PropTypes.string.isRequired,
});

var variablesTree = PropTypes.shape({
  children: PropTypes.objectOf(variablesTree),
  opened: PropTypes.bool,
  path: PropTypes.arrayOf(PropTypes.string),
  variables: PropTypes.arrayOf(variable),
});


export default {variable, variablesTree};
