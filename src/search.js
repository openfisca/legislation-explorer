import {ascend, assoc, concat, filter, flatten, isEmpty, keys, map, merge, pipe, prop, sortBy, sortWith, partition} from "ramda"
import * as diacritics from 'diacritics'

function preprocessParametersAndVariables(parameters, variables) {
  return flatten(
    [parameters, variables].map(
      parametersOrVariables => keys(parametersOrVariables).map(
        itemId => merge(parametersOrVariables[itemId], {name: itemId})
      )
    )
  )
}

export function findParametersAndVariables(parameters, variables, query) {
  const normalizedQuery = diacritics.remove(query.toLowerCase())
  const parametersAndVariables = preprocessParametersAndVariables(parameters, variables)
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

export function addNormalizedDescription(objects) {
  return map(
    object => assoc(
      'normalizedDescription',
      object.description
        ? diacritics.remove(object.description.toLowerCase())
        : '',
      object
    ),
    objects
  )
}
