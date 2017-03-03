import {ascend, assoc, concat, filter, has, isEmpty, map, pipe, prop, sortBy, sortWith, partition} from "ramda"
import * as diacritics from 'diacritics'


export function findParametersAndVariables(parameters, variables, query) {
  const normalizedQuery = diacritics.remove(query.toLowerCase())
  const parametersAndVariables = concat(parameters, variables)
  if (isEmpty(normalizedQuery)) {
    return sortBy(prop('name'), parametersAndVariables)
  }
  let [matchesInName, others] = partition(
    item => item.name.includes(normalizedQuery),
    parametersAndVariables,
  )
  matchesInName = sortWith([
    ascend(item => item.name.indexOf(normalizedQuery)),
    ascend(prop('name')),
  ], matchesInName)
  const matchesInDescriptionOnly = pipe(
    filter(item => item.normalizedDescription.includes(normalizedQuery)),
    sortBy(prop('name')),
  )(others)
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
