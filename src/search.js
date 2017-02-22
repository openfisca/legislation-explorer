import {ascend, assoc, concat, descend, has, isEmpty, map, prop, sortBy, sortWith} from "ramda"
import * as diacritics from 'diacritics'


export function findParametersAndVariables(parameters, variables, query) {
  function indexInString(substring, string) {
    const index = string.indexOf(substring)
    return index === -1 ? Number.MAX_SAFE_INTEGER : index
  }
  const normalizedQuery = diacritics.remove(query.toLowerCase())
  let parametersAndVariables = concat(
    map(assoc('type', 'parameter'), parameters),
    map(assoc('type', 'variable'), variables),
  )
  const sortFunction = isEmpty(normalizedQuery)
    ? sortBy(prop('name'))
    : sortWith([
      ascend(item => indexInString(normalizedQuery, item.name)),
      descend(item => item.searchIndex.includes(normalizedQuery)),
      ascend(prop('name')),
    ])
  return sortFunction(parametersAndVariables)
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
