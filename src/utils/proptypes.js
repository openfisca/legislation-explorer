import PropTypes from 'prop-types'


const valuesShape = PropTypes.objectOf(PropTypes.oneOfType([
  PropTypes.bool,
  PropTypes.number,
  PropTypes.string,
]))

const roleShape = PropTypes.shape({
  description: PropTypes.string,
  plural: PropTypes.string,
  max: PropTypes.number,
  min: PropTypes.number,
})


export const entityShape = PropTypes.shape({
  id: PropTypes.string,
  description: PropTypes.string,
  normalizedDescription: PropTypes.string,
  documentation: PropTypes.string,
  roles: PropTypes.objectOf(roleShape),
})

export const locationShape = PropTypes.shape({
  pathname: PropTypes.string.isRequired,
  search: PropTypes.string.isRequired,
  hash: PropTypes.string.isRequired,
  state: PropTypes.object
})

export const parameterShape = PropTypes.shape({
  id: PropTypes.string,
  description: PropTypes.string,
  documentation: PropTypes.string,
  normalizedDescription: PropTypes.string,
  values: valuesShape,
  brackets: PropTypes.objectOf(valuesShape),
})

export const routerShape = PropTypes.shape({
  action: PropTypes.string.isRequired,
  location: locationShape.isRequired,
  push: PropTypes.func.isRequired,
  replace: PropTypes.func.isRequired,
  go: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired,
  canGo: PropTypes.func,
  block: PropTypes.func.isRequired,
  listen: PropTypes.func.isRequired
})

export const variableShape = PropTypes.shape({
  id: PropTypes.string,
  description: PropTypes.string,
  definitionPeriod: PropTypes.string,
  documentation: PropTypes.string,
  entity: PropTypes.string,
  formulas: PropTypes.object,
  normalizedDescription: PropTypes.string,
  source: PropTypes.string,
})
