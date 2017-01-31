import {all, append, intersperse, isNil, lensPath, map, merge, over, pipe, prepend, reduce, reject, values} from "ramda"


export function buildVariablesTree(variables, query) {
  const getVariablePath = variable => prepend('children', intersperse("children", variable.source_file_path.split("/")))
  function filterByQuery(variable) {
    if (!query) {
      return true
    }
    const normalizedQuery = query.toLowerCase()
    return variable.name.toLowerCase().includes(normalizedQuery)
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
