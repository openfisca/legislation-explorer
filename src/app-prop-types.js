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
  formula: PropTypes.object,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  normalizedDescription: PropTypes.string,
  // Introspection (optional: variables declared in notebooks have no introspection attributes)
  source_file_path: PropTypes.string,
  start_line_number: PropTypes.number,
  end_line_number: PropTypes.number,
})
