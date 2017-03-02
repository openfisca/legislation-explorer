import {ascend, assoc, concat, contains, filter, has, isEmpty, map, pipe, prop, sortBy, sortWith} from "ramda"
import * as diacritics from 'diacritics'


export function findParametersAndVariables(parameters, variables, query) {
  const normalizedQuery = diacritics.remove(query.toLowerCase())
  const parametersAndVariables = concat(parameters, variables)
  if (isEmpty(normalizedQuery)) {
    return sortBy(prop('name'), parametersAndVariables)
  }
  const matchesInName = pipe(
    filter(item => item.name.includes(normalizedQuery)),
    sortWith([
      ascend(item => item.name.indexOf(normalizedQuery)),
      ascend(prop('name')),
    ]),
  )(parametersAndVariables)
  const matchesInDescriptionOnly = pipe(
    filter(item =>
      !contains(item.name, map(prop('name'), matchesInName)) && // Exclude items already in matchesInName.
      item.normalizedDescription.includes(normalizedQuery)
    ),
    sortBy(prop('name')),
  )(parametersAndVariables)
  return concat(matchesInName, matchesInDescriptionOnly)
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
