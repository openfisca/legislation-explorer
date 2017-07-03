import {ascend, assoc, concat, descend, filter, flatten, isEmpty, keys, map, merge, pipe, prop, sortBy, sortWith, partition} from "ramda"
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

function answersQuery(queryWords, parameterOrVariable){
  //Declare new properties for name/query matching:
  parameterOrVariable.matches = 0
  parameterOrVariable.indexes_sum = 0

  for (var j in queryWords) {
    parameterOrVariable.matches += parameterOrVariable.name.includes(queryWords[j]) ? 1 : 0
    parameterOrVariable.indexes_sum += parameterOrVariable.name.indexOf(queryWords[j])
  }
  return parameterOrVariable.matches > 0
}

export function findParametersAndVariables(parameters, variables, query) {
  const normalizedQuery = diacritics.remove(query.toLowerCase())
  const queryWords = normalizedQuery.split(" ")

  const parametersAndVariables = preprocessParametersAndVariables(parameters, variables)
  if (isEmpty(normalizedQuery)) {
    return sortBy(prop('name'), parametersAndVariables)
  }

  let [matchesInName, others] = partition(
    item => (answersQuery(queryWords, item) > 0),
    parametersAndVariables,
  )

  //First words in query are more important than next ones:
  matchesInName = sortWith([
    descend(prop('matches')),
    ascend(prop('indexes_sum')),
    ascend(prop('name')),
  ], matchesInName)

  const matchesInDescriptionOnly = pipe(
    filter(item => queryWords.some(function(v) { return item.normalizedDescription.includes(v); }) != []),
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
