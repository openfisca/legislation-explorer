import PropTypes from 'prop-types'


const valuesShape = PropTypes.objectOf(PropTypes.oneOfType([
  PropTypes.bool,
  PropTypes.number,
  PropTypes.string,
]))

export const parameterShape = PropTypes.shape({
  id: PropTypes.string,
  description: PropTypes.string,
  normalizedDescription: PropTypes.string,
  values: valuesShape,
  brackets: PropTypes.objectOf(valuesShape),
})

export const variableShape = PropTypes.shape({
  id: PropTypes.string,
  description: PropTypes.string,
  definitionPeriod: PropTypes.string,
  entity: PropTypes.string,
  formulas: PropTypes.object,
  normalizedDescription: PropTypes.string,
  source: PropTypes.string,
})
