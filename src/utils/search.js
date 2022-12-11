import * as ramda from 'ramda'
import diacritics from 'diacritics'


type Item = {
  name: string,
  indexesSum: number,
  matchesInName: number,
  [key: string]: any,
}

type Items = {
  [key: string]: Item,
}

type SortBy = {
  (a: any, b: any): any
}

/**
 * Adds the name property to an object.
 *
 * @param {Item} item - The object to add the name property to.
 * @param {string} value - The name to add the name property to.
 * @returns {Item} A new object with the name property added.
 */
const addNameToItem = (item: Item, value: string): Item => {
  return {...item, name: value}
}

/**
 * Adds the name property to each item in an array.
 *
 * @param {Items} items - The map of items to add the name property to.
 * @returns {Item[]} A new array of items with the name property added.
 */
const addNameToItems = (items: Items): Item[] => {
  return (
    Object
      .keys(items)
      .map(name => addNameToItem(items[name], name))
  )
}

/**
 * Adds the name property to entities, parameters, and variables.
 *
 * @param {Items[]} items - Array of entities, parameters and variables.
 * @returns {Item[]} A new array of objects with the name property added.
 */
const preprocessItems = (...items: Items[]): Item[] => {
  return items.flatMap(addNameToItems)
}

/**
 * Returns a list of items that match the given query words.
 *
 * The items in the returned list are sorted by the number of matches in the
 * name of the item and the index of the first match in the description.
 *
 * @param {Item[]} items - The list of items to search.
 * @param {Item} item - The item to search for.
 * @param {string[]} queryWords - The query words to search for.
 * @returns {Item[]} - A list of items that match the given query words.
 */
const match = (items: Item[], item: Item, queryWords: string[]): Item[] => {
  let matchesInName = 0
  let indexesSum = 0

  if (queryWords.length === 0) return items

  for (const word of queryWords) {
    const indexInName = item.name.indexOf(word)

    if (indexInName > -1) {
      matchesInName += 1
      indexesSum += indexInName
      continue
    }

    const indexInDescription = item.normalizedDescription.indexOf(word)

    if (indexInDescription > -1) {
      indexesSum += item.normalizedDescription.indexOf(word)
      continue
    }

    return items
  }

  return [...items, {...item, matchesInName, indexesSum}]
}

/**
 * Sorts a list of items based on their `matchesInName`, `indexesSum`, and
 * `name` properties.
 *
 * @param {Item[]} items - The items to sort.
 * @returns {Item[]} The sorted items.
 */
const sort = (items: Item[]): Item[] => {
  const array: SortBy[] = [
    ramda.descend((item: Item) => item.matchesInName),
    ramda.ascend((item: Item) => item.indexesSum),
    ramda.ascend((item: Item) => item.name),
  ]

  return ramda.sortWith(array, items)
}

/**
 * Normalises the description of an map by removing diacritics and lowercasing.
 *
 * @param {Object} options - Map containing description and other properties.
 * @return {Object} A map with the normalised description.
 */
const normalise = (
  {description, ...map}: { description?: string }
): { [key: string]: any } => {
  if (!description) return {}
  const lowerCase = description.toLowerCase()
  return {
    ...map,
    description,
    normalizedDescription: diacritics.remove(lowerCase),
  }
}


/**
 * Returns a list of items that match the given query.
 *
 * The items in the returned list are sorted by the number of matches in the
 * name of the item and the index of the first match in the description.
 *
 * @param {Items} entities - The list of entities to search.
 * @param {Items} parameters - The list of parameters to search.
 * @param {Items} variables - The list of variables to search.
 * @param {string} query - The query to search for.
 * @returns {Item[]} - A list of items that match the given query.
 */
const findCountryModelItems = (
  entities: Items,
  parameters: Items,
  variables: Items,
  query: string,
): Item[] => {
  const countryModelItems = preprocessItems(entities, parameters, variables)
  const normalizedQuery = diacritics.remove(query.toLowerCase())
  const queryWords = normalizedQuery.split(' ')

  if (ramda.isEmpty(normalizedQuery)) {
    return ramda.sortBy((item: Item) => item.name, countryModelItems)
  }

  const items: Item[] = countryModelItems
    .reduce((items: Item[], item: Item): Item[] => {
      return [...match(items, item, queryWords)]
    }, [])

  return sort(items)
}

/**
 * Adds the `normalizedDescription` property to each object in an array.
 *
 * @param {Object[]} objects - An array of objects to be updated.
 * @return {Object[]} An array of objects with `normalizedDescription`.
 */
const addNormalizedDescription = (
  objects: { [key: string]: any }[]
): { [key: string]: any }[] => {
  return ramda.map(object => normalise(object), objects)
}


export default {findCountryModelItems,  addNormalizedDescription}
