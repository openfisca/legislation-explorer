import {ascend, assoc, descend, flatten, isEmpty, keys, map, merge, prop, sortBy, sortWith} from 'ramda'
import * as diacritics from 'diacritics'

function preprocessCountryModelItems(entities, parameters, variables) {
  return flatten(
    [entities, parameters, variables].map(
      countryModelItems => keys(countryModelItems).map(
        itemId => merge(countryModelItems[itemId], {name: itemId})
      )
    )
  )
}

export function findCountryModelItems(entities, parameters, variables, query) {
  const normalizedQuery = diacritics.remove(query.toLowerCase())
  const queryWords = normalizedQuery.split(' ')

  const countryModelItems = preprocessCountryModelItems(entities, parameters, variables)
  if (isEmpty(normalizedQuery)) {
    return sortBy(prop('name'), countryModelItems)
  }

  const matches = countryModelItems.reduce(
    (matches, item) => {
      item.matchesInName = 0
      item.indexesSum = 0
      for (const word of queryWords) {
        const indexInName = item.name.indexOf(word)
        if (indexInName > -1) {
          item.matchesInName += 1
          item.indexesSum += indexInName
        } else {
          const indexInDescription = item.normalizedDescription.indexOf(word)
          if (indexInDescription > -1) {
            item.indexesSum += item.normalizedDescription.indexOf(word)
          } else {
            // This query word is included neither in the name, nor in the descriptions. We don't add it to the result an move on to the next item.
            return matches
          }
        }
      }
      matches.push(item)
      return matches
    }, [])

  return sortWith([
    descend(prop('matchesInName')),
    ascend(prop('indexesSum')),
    ascend(prop('name')),
  ], matches)
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
