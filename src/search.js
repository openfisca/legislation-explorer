import {ascend, assoc, concat, filter, isEmpty, map, pipe, prop, sortBy, sortWith, partition} from "ramda"
import * as diacritics from 'diacritics'

function preprocessParameters(parameters) {
  return Object.keys(parameters).map(
    paramId => Object.assign({}, parameters[paramId], {name: paramId})
  )
}

export function findParametersAndVariables(parameters, variables, query) {
  const normalizedQuery = diacritics.remove(query.toLowerCase())
  const parametersAndVariables = concat(preprocessParameters(parameters), variables)
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
      object[propertyName]
        ? diacritics.remove(object[propertyName].toLowerCase())
        : '',
      object
    ),
    objects
  )
}
