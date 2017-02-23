import {ascend, assoc, concat, descend, has, isEmpty, map, prop, sortBy, sortWith} from "ramda"
import * as diacritics from 'diacritics'


export function findParametersAndVariables(parameters, variables, query) {
  function weightIn(string, substring) {
    const index = string.indexOf(substring)
    return index === -1 ? Number.MAX_SAFE_INTEGER : index
  }
  const normalizedQuery = diacritics.remove(query.toLowerCase())
  const parametersAndVariables = concat(parameters, variables)
  if (isEmpty(normalizedQuery)) {
    return sortBy(prop('name'), parametersAndVariables)
  }
  return sortWith([
    ascend(item => weightIn(item.name, normalizedQuery)),
    descend(item => item.normalizedDescription.includes(normalizedQuery)),
    ascend(prop('name')),
  ], parametersAndVariables)
}

export function addNormalizedDescription(propertyName, objects) {
  return map(
    object => assoc(
      'normalizedDescription',
      has(propertyName, object)
        ? diacritics.remove(object[propertyName].toLowerCase())
        : '',
      object
    ),
    objects
  )
}
