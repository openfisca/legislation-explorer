import DocumentTitle from "react-document-title"
import React, {PropTypes} from "react"
import {Link} from "react-router"
import {all, append, intersperse, isNil, lensPath, map, merge, over, pipe, prepend, reduce, reject, sortBy, toPairs, values} from "ramda"
import TreeView from 'react-treeview'

import * as AppPropTypes from "../../app-prop-types"
import BreadCrumb from "../breadcrumb"
import GitHubLink from "../github-link"
import List from "../list"
import SearchBox from "../search-box"


function buildVariablesTree(variables, nameFilter, labelFilter) {
  const getVariablePath = variable => prepend('children', intersperse("children", variable.source_file_path.split("/")))
  const matchFilters = variable => (!nameFilter || variable.name.toLowerCase().includes(nameFilter.toLowerCase())) && (
    !labelFilter || variable.label && variable.label.toLowerCase().includes(labelFilter.toLowerCase())
  )
  function removeEmptyNodes(node) {
    if (isNil(node.children)) {
      return node
    } else {
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
  }
  return pipe(
    reduce(
      (memo, variable) => over(
        lensPath(getVariablePath(variable)),
        node => matchFilters(variable)
          ? node
            ? over(lensPath(["variables"]), append(variable), node)
            : {variables: [variable]}
          : node,
        memo,
      ),
      {}
    ),
    removeEmptyNodes,
  )(variables)
}


const VariablesPage = React.createClass({
  propTypes: {
    countryPackageName: PropTypes.string.isRequired,
    countryPackageVersion: PropTypes.string.isRequired,
    variables: PropTypes.arrayOf(AppPropTypes.variable).isRequired,
  },
  getInitialState() {
    return {
      labelFilter: "",
      nameFilter: ""
    }
  },
  onSearchBoxLabelChange(labelFilter) {
    this.setState({labelFilter})
  },
  onSearchBoxNameChange(nameFilter) {
    this.setState({nameFilter})
  },
  render() {
    const {variables} = this.props
    let variablesTree = buildVariablesTree(variables, this.state.nameFilter, this.state.labelFilter)
    return (
      <DocumentTitle title="Variables - Explorateur de la législation">
        <div>
          <BreadCrumb>
            <li className="active">Variables</li>
          </BreadCrumb>
          <div className="page-header">
            <h1>Variables et formules socio-fiscales</h1>
          </div>
          <p>
            La liste suivante contient les variables qui ont été renseignées dans OpenFisca,
            hiérarchisés de la même façon que les fichiers du code source en Python.
            Une variable est soit une formule de calcul (ie un impôt)
            soit une valeur saisie par l'utilisateur (ie un salaire).
          </p>
          <SearchBox
            labelFilter={this.state.labelFilter}
            nameFilter={this.state.nameFilter}
            onLabelChange={this.onSearchBoxLabelChange}
            onNameChange={this.onSearchBoxNameChange}
          />
          {
            variablesTree
              ? this.renderTreeNode(variablesTree.children.model, {path: []})
              : <p>Aucun résultat</p>
          }
        </div>
      </DocumentTitle>
    )
  },
  renderTreeNode(node, accu) {
    const {countryPackageName, countryPackageVersion} = this.props
    const {children, variables} = node
    return (
      <span>
        {
          children && toPairs(children).map(
            ([name, child]) => {
              const nodeLabel = (
                <span>
                  {name}
                  <GitHubLink
                    blobUrlPath={[countryPackageName, 'model'].concat(accu.path).concat(name).join('/')}
                    commitReference={countryPackageVersion}
                    style={{marginLeft: "1em"}}
                    text={null}
                  />
                </span>
              )
              return (
                <TreeView key={name} nodeLabel={nodeLabel}>
                  {this.renderTreeNode(child, {path: accu.path.concat(name)})}
                </TreeView>
              )
            },
            children,
          )
        }
        {
          variables && (
            <List items={sortBy(variable => variable.label || variable.name , variables)} type="unstyled">
              {
                (variable) => (
                  <span>
                    <Link to={`/variables/${variable.name}`}>
                      {variable.label || variable.name}
                    </Link>
                    <GitHubLink
                      blobUrlPath={[countryPackageName, 'model'].concat(accu.path).join('/')}
                      commitReference={countryPackageVersion}
                      endLineNumber={variable.end_line_number}
                      lineNumber={variable.start_line_number}
                      style={{marginLeft: "1em"}}
                      text={null}
                    />
                  </span>
                )
              }
            </List>
          )
        }
      </span>
    )
  },
})


export default VariablesPage
