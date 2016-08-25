import DocumentTitle from "react-document-title"
import React, {PropTypes} from "react"
import {Link} from "react-router"
import {append, intersperse, lensPath, over, prepend, reduce, sortBy, toPairs} from "ramda"

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
        : {variables: []},
      memo,
    ),
    {},
    variables
  )
}


const VariablesTreeNode = React.createClass({
  propTypes: {
    node: PropTypes.object.isRequired,
  },
  render() {
    const {node} = this.props
    const {children, variables} = node
    return (
      <span>
        <ul>
          {
            children && toPairs(children).map(
              ([name, child]) => (
                <li key={name}>
                  {name}
                  <VariablesTreeNode node={child} />
                </li>
              ),
              children,
            )
          }
        </ul>
        {
          variables && (
            <List items={sortBy(variable => variable.label || variable.name , variables)}>
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
          <VariablesTreeNode node={variablesTree} />
        </div>
      </DocumentTitle>
    )
  },
})


export default VariablesPage
