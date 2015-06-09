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
import ImmutablePropTypes from "react-immutable-proptypes";


// Level 0 PropTypes

var unit = PropTypes.oneOf([
  "currency",
  "day",
  "hour",
  "month",
  "year",
]);

var formula = PropTypes.shape({
  input_variables: PropTypes.arrayOf(PropTypes.string),
  line_number: PropTypes.number,
  module: PropTypes.string.isRequired,
  parameters: PropTypes.arrayOf(PropTypes.string),
});

var startStopValue = PropTypes.shape({
  end_line_number: PropTypes.number.isRequired,
  start: PropTypes.string.isRequired,
  start_line_number: PropTypes.number.isRequired,
  stop: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
  ]).isRequired,
});


// Level 1 PropTypes

var datedFormula = PropTypes.shape({
  dated_formulas: PropTypes.arrayOf(
    PropTypes.shape({
      formula: formula.isRequired,
      start_instant: PropTypes.string,
      stop_instant: PropTypes.string,
    })
  ).isRequired,
});

var immutableChildren = ImmutablePropTypes.mapOf(immutableVariablesTree);

var immutableVariables = ImmutablePropTypes.listOf(variable);

var immutableVariablesTree = ImmutablePropTypes.shape({
  immutableChildren,
  opened: PropTypes.bool,
  immutableVariables,
});

var loading = PropTypes.oneOfType([
  PropTypes.bool,
  PropTypes.string,
]);

var parameter = PropTypes.shape({
  "@type": PropTypes.oneOf(["Parameter"]).isRequired,
  description: PropTypes.string,
  end_line_number: PropTypes.number.isRequired,
  format: PropTypes.oneOf([
    "boolean",
    "float",
    "integer",
    "rate",
  ]).isRequired,
  start_line_number: PropTypes.number.isRequired,
  unit,
  values: PropTypes.arrayOf(startStopValue),
});

var scale = PropTypes.shape({
  "@type": PropTypes.oneOf(["Scale"]).isRequired,
  brackets: PropTypes.arrayOf(
    PropTypes.shape({
      end_line_number: PropTypes.number.isRequired,
      rate: PropTypes.arrayOf(startStopValue).isRequired,
      start_line_number: PropTypes.number.isRequired,
      threshold: PropTypes.arrayOf(startStopValue).isRequired,
    }),
  ),
  description: PropTypes.string,
  end_line_number: PropTypes.number.isRequired,
  start_line_number: PropTypes.number.isRequired,
  unit,
});

var variable = PropTypes.shape({
  formula: PropTypes.oneOfType([formula, datedFormula]),
  label: PropTypes.string,
  line_number: PropTypes.number,
  module: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
});


// Level 2 PropTypes

var parameterOrScale = PropTypes.oneOfType([
  parameter,
  scale,
]);


export default {immutableChildren, immutableVariables, immutableVariablesTree, loading, parameterOrScale, variable};
