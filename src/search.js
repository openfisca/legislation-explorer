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

function sumIndexes(words, string) {
  var sum = 0
  var index = 0
  for (var i in words) {
    sum += string.indexOf(words[i])
  }
  return sum
}

function answersQuery(queryWords, parameterOrVariable){
  parameterOrVariable.indexes_sum = sumIndexes(queryWords, parameterOrVariable.name)
  parameterOrVariable.matches = countMatches(queryWords, parameterOrVariable.name)
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
  //for(var i=queryWords.length; i--;) {
    matchesInName = sortWith([
      descend(prop('matches')),
      //ascend(item => item.name.indexOf(queryWords[i])),
      ascend(prop('indexes_sum'))
      //ascend(prop('name')),
    ], matchesInName)
  //}

  console.log("matchesInName ", matchesInName)


  const matchesInDescriptionOnly = pipe(
    filter(item => queryWords.some(function(v) { return item.normalizedDescription.includes(v); }) != []),
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
