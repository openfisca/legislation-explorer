import {PropTypes} from "react"


// Level 0 PropTypes

export const value = PropTypes.oneOfType([
  PropTypes.bool,
  PropTypes.number,
  PropTypes.string,
])

export const values = PropTypes.objectOf(value)

export const parameter = PropTypes.shape({
  id: PropTypes.string,
  description: PropTypes.string,
  normalizedDescription: PropTypes.string,
  brackets: PropTypes.objectOf(values),
  values,
})

export const variable = PropTypes.shape({
  id: PropTypes.string,
  description: PropTypes.string,
  definitionPeriod: PropTypes.string,
  entity: PropTypes.string,
  formulas: PropTypes.object,
  normalizedDescription: PropTypes.string,
  source: PropTypes.string,
})
