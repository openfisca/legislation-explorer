import {all, append, intersperse, isNil, lensPath, map, merge, over, pipe, prepend, reduce, reject, values} from "ramda"
import removeAccents from 'remove-accents'


export function buildVariablesTree(variables, query) {
  const getVariablePath = variable => prepend('children', intersperse("children", variable.source_file_path.split("/")))
  function filterByQuery(variable) {
    if (!query) {
      return true
    }
    function nameMatches(variable, query) {
      const normalizedName = variable.name.toLowerCase()
      return normalizedName.includes(query)
    }
    function labelMatches(variable, query) {
      if (!variable.label) {
        return false
      }
      const normalizedLabel = removeAccents(variable.label.toLowerCase())
      return normalizedLabel.includes(query)
    }
    const normalizedQuery = removeAccents(query.toLowerCase())
    return nameMatches(variable, normalizedQuery) || labelMatches(variable, normalizedQuery)
  }
  function listToFilteredTree(variables) {
    return reduce(
      (memo, variable) => over(
        lensPath(getVariablePath(variable)),
        node => filterByQuery(variable)
          ? node
            ? over(lensPath(["variables"]), append(variable), node)
            : {variables: [variable]}
          : node,
        memo,
      ),
      {},
      variables
    )
  }
  function removeEmptyNodes(node) {
    if (isNil(node.children)) {
      return node
    }
    const cleanNode = merge(
      node,
      {
        children: pipe(
          reject(isNil),
          map(removeEmptyNodes),
          reject(isNil),
          )(node.children)
      }
    )
    return all(isNil, values(cleanNode.children))
      ? null
      : cleanNode
  }
  return pipe(listToFilteredTree, removeEmptyNodes)(variables)
}
