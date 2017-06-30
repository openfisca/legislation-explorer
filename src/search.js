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

function countMatches(words, string) {
  var matches = 0
  for (var i in words) {
    if (string.includes(words[i])) {
      matches += 1
    }
  }
  return matches
}

export function findParametersAndVariables(parameters, variables, query) {
  console.log("query ", query)

  const normalizedQuery = diacritics.remove(query.toLowerCase())

  const parametersAndVariables = preprocessParametersAndVariables(parameters, variables)
  if (isEmpty(normalizedQuery)) {
    return sortBy(prop('name'), parametersAndVariables)
  }

  const queryWords = normalizedQuery.split(" ")
  console.log(queryWords)


  let [matchesInName, others] = partition(
    item => (countMatches(queryWords, item.name) > 0),
    parametersAndVariables,
  )
  console.log("matchesInName ", matchesInName)
  matchesInName = sortWith([
    ascend(item => item.name.indexOf(normalizedQuery)),
    ascend(prop('name')),
  ], matchesInName)
  console.log("matchesInName ", matchesInName)

  const matchesInDescriptionOnly = pipe(
    filter(item => item.normalizedDescription.includes(normalizedQuery)),
    sortBy(prop('name')),
  )(others)
  console.log("matchesInDescriptionOnly ", matchesInDescriptionOnly)

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
