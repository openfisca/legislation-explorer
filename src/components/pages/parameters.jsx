import DocumentTitle from "react-document-title"
import React, {PropTypes} from "react"
import {Link} from "react-router"

import * as AppPropTypes from "../../app-prop-types"
import List from "../list"


const ParametersPage = React.createClass({
  propTypes: {
    parameters: PropTypes.arrayOf(AppPropTypes.parameterOrScale).isRequired,
  },
  render() {
    const {parameters} = this.props
    return (
      <DocumentTitle title="Paramètres - Explorateur de la législation">
        <div>
          <div className="page-header">
            <h1>Paramètres de la législation</h1>
          </div>
          <p>La liste suivante contient les paramètres de la législation qui ont été renseignés dans OpenFisca.</p>
          <List items={parameters} keyProperty="name">
            {parameter => <Link to={`/parameters/${parameter.name}`}>{parameter.description}</Link>}
          </List>
        </div>
      </DocumentTitle>
    )
  },
})


export default ParametersPage
