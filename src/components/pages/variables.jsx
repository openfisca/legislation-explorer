import DocumentTitle from "react-document-title"
import React, {PropTypes} from "react"
import {Link} from "react-router"
import {append, intersperse, lensPath, over, prepend, reduce, sortBy, toPairs} from "ramda"
import TreeView from 'react-treeview'

import * as AppPropTypes from "../../app-prop-types"
import BreadCrumb from "../breadcrumb"
import List from "../list"


function buildVariablesTree(variables) {
  const getVariablePath = variable => prepend('children', intersperse("children", variable.source_file_path.split("/")))
  return reduce(
    (memo, variable) => over(
      lensPath(getVariablePath(variable)),
      node => node
        ? over(lensPath(["variables"]), append(variable), node)
        : {variables: [variable]},
      memo,
    ),
    {},
    variables
  )
}


const VariablesPage = React.createClass({
  propTypes: {
    countryPackageVersion: PropTypes.string.isRequired,
    variables: PropTypes.arrayOf(AppPropTypes.variable).isRequired,
  },
  render() {
    const {variables} = this.props
    let variablesTree = buildVariablesTree(variables)
    // Skip the first levels of depth for nicer view.
    variablesTree = variablesTree.children.model
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
          {this.renderTreeNode(variablesTree)}
        </div>
      </DocumentTitle>
    )
  },
  renderTreeNode(node) {
    const {children, variables} = node
    return (
      <span>
        {
          children && toPairs(children).map(
            ([name, child]) => (
              <TreeView key={name} nodeLabel={name}>
                {this.renderTreeNode(child)}
              </TreeView>
            ),
            children,
          )
        }
        {
          variables && (
            <List items={sortBy(variable => variable.label || variable.name , variables)} type="unstyled">
              {
                ({name, label}) => (
                  <Link to={`/variables/${name}`}>
                    {label || name}
                  </Link>
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
