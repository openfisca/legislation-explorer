import React, { PropTypes } from "react"
import { Link, locationShape, routerShape } from "react-router"
import { FormattedMessage } from "react-intl"

import * as AppPropTypes from "../../app-prop-types"
import Parameter from "../parameter"
import Variable from "../variable"
import { searchInputId } from "./home"
import { fetchParameter, fetchVariable } from "../../webservices"


const ParameterOrVariablePage = React.createClass({
  contextTypes: {
    router: routerShape.isRequired,
    searchQuery: PropTypes.string.isRequired,
    searchResults: PropTypes.array.isRequired,
  },
  propTypes: {
    countryPackageName: PropTypes.string.isRequired,
    countryPackageVersion: PropTypes.string.isRequired,
    location: locationShape.isRequired,
    params: PropTypes.shape({ name: PropTypes.string.isRequired }).isRequired, // URL params
    parameters: PropTypes.objectOf(AppPropTypes.parameter).isRequired,
    variables: PropTypes.objectOf(AppPropTypes.variable).isRequired,
  },
  getInitialState() {
    return {variable: null, parameter: null, waitingForResponse: true}
  },
  fetchPageContent(name) {
    if (this.props.variables[name]) {
      fetchVariable(name).then(
        variable => {
          this.setState({variable: variable.data, waitingForResponse: false})
        }
      )
    } else if (this.props.parameters[name]) {
      fetchParameter(name).then(
        parameter => {
          this.setState({parameter: parameter.data, waitingForResponse: false})
        }
      )
    } else {
        this.setState({waitingForResponse: false})
        this.handleNotFound()
    }
  },
  componentWillReceiveProps(nextProps) {
    this.fetchPageContent(nextProps.params.name)
  },
  componentDidMount() {
    this.fetchPageContent(this.props.params.name)
  },
  handleNotFound() {
    const name = this.props.params.name
    return this.context.router.push({
      pathname: "/",
      query: {q: name, is404: true},
      hash: "#not-found",
      })
  },

  render() {
    const { searchQuery, searchResults } = this.context
    const {countryPackageName, countryPackageVersion, parameters, variables} = this.props
    const {parameter, variable} = this.state
    const goBackLocation = {
      pathname: "/",
      query: {q: searchQuery},
      hash: `#${searchInputId}`,
    }
    const otherResultsCount = searchResults.length - 1

    if (this.state.waitingForResponse) {
      return (
        <div className="loading">
          <span className="glyphicon glyphicon-refresh"></span>
          <FormattedMessage id="loading"/>
        </div>
      )
    }

    return (
      <div>
        <Link className="btn btn-default" to={goBackLocation}>
          <FormattedMessage id={ otherResultsCount > 1 ? 'seeOtherResults' : 'backToHP' }
            values={{ otherResultsCount }}
          />
        </Link>
        {
          parameter && (
            <Parameter
              countryPackageName={countryPackageName}
              countryPackageVersion={countryPackageVersion}
              parameter={parameter}
            />
          )
        }
        {
          variable && (
            <Variable
              countryPackageName={countryPackageName}
              countryPackageVersion={countryPackageVersion}
              parameters={parameters}
              variable={variable}
              variables={variables}
            />
          )
        }
      </div>
    )
  },
})


export default ParameterOrVariablePage
