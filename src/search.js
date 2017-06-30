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
  const normalizedQuery = diacritics.remove(query.toLowerCase())
  const queryWords = normalizedQuery.split(" ")

  const parametersAndVariables = preprocessParametersAndVariables(parameters, variables)
  if (isEmpty(normalizedQuery)) {
    return sortBy(prop('name'), parametersAndVariables)
  }

  let [matchesInName, others] = partition(
    item => ((item.matches = countMatches(queryWords, item.name)) > 0),
    parametersAndVariables,
  )

  for(var i = queryWords.length; i--;){
    matchesInName = sortWith([
      descend(prop('matches')),
      ascend(item => item.name.indexOf(queryWords[i])),
      ascend(prop('name')),
    ], matchesInName)
  }
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
