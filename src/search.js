import {assoc, concat, filter, has, isEmpty, map, pipe, prop, sortBy} from "ramda"
import * as diacritics from 'diacritics'


export function findParametersAndVariables(parameters, variables, query) {
  function matchesQuery(parameterOrVariable) {
    if (isEmpty(normalizedQuery)) {
      return true
    }
    return parameterOrVariable.name.includes(normalizedQuery) ||
      parameterOrVariable.searchIndex.includes(normalizedQuery)
  }
  const normalizedQuery = diacritics.remove(query.toLowerCase())
  return pipe(
    filter(matchesQuery),
    sortBy(prop('name')),
  )(concat(
    map(assoc('type', 'parameter'), parameters),
    map(assoc('type', 'variable'), variables),
  ))
}

export function withSearchIndex(propertyName, objects) {
  return map(
    object => assoc(
      'searchIndex',
      has(propertyName, object)
        ? diacritics.remove(object[propertyName].toLowerCase())
        : '',
      object
    ),
    objects
  )
}
