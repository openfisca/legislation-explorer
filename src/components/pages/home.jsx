import {isEmpty, map} from "ramda"
import React, {PropTypes} from "react"
import {Link} from "react-router"
import {locationShape} from "react-router/lib/PropTypes"

import * as AppPropTypes from "../../app-prop-types"
import {findParametersAndVariables} from "../../search"


const HomePage = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired,
  },
  propTypes: {
    countryPackageName: PropTypes.string.isRequired,
    countryPackageVersion: PropTypes.string.isRequired,
    location: locationShape.isRequired,
    parameters: PropTypes.arrayOf(AppPropTypes.parameterOrScale).isRequired,
    variables: PropTypes.arrayOf(AppPropTypes.variable).isRequired,
  },
  componentDidMount() {
    this.context.router.listen(this.locationHasChanged)
  },
  componentWillUnmount() {
    this.context.router.unregisterTransitionHook(this.locationHasChanged)
  },
  getInitialState() {
    return {inputValue: ""}
  },
  handleClearSearchClicked() {
    this.setState({inputValue: ""})
    this.context.router.push("")
  },
  handleInputChange(event) {
    this.setState({inputValue: event.target.value})
  },
  handleSubmit(event) {
    event.preventDefault()
    this.context.router.push(`?q=${this.state.inputValue}`)
  },
  locationHasChanged(location) {
    const query = location.query.q || ""
    this.setState({inputValue: query})
  },
  render() {
    const {parameters, variables} = this.props
    const {inputValue} = this.state
    const query = this.props.location.query.q || ""
    const foundParametersAndVariables = findParametersAndVariables(parameters, variables, query)
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <div className="input-group input-group-lg" style={{margin: "2em 0"}}>
            <input
              className="form-control"
              onChange={this.handleInputChange}
              placeholder="smic, salaire net…"
              type="text"
              value={inputValue}
            />
            <div className="input-group-btn">
              {
                !isEmpty(query) && (
                  <button
                    className="btn btn-default"
                    onClick={this.handleClearSearchClicked}
                    title="Effacer la recherche"
                    type="button"
                  >
                    <span className="glyphicon glyphicon-remove" aria-hidden="true" />
                  </button>
                )
              }
              <button className="btn btn-default" type="submit">Trouver</button>
            </div>
          </div>
        </form>
        <section>
          {
            isEmpty(foundParametersAndVariables)
              ? <h4>Aucun résultat</h4>
              : map(this.renderCard, foundParametersAndVariables)
          }
        </section>
      </div>
    )
  },
  renderCard(parameterOrVariable) {
    const description = parameterOrVariable.type === 'parameter'
      ? parameterOrVariable.description
      : parameterOrVariable.label
    return (
      <Link key={`${parameterOrVariable.name}-${parameterOrVariable.type}`} to={parameterOrVariable.name}>
        <article style={{margin: "3em 0"}}>
          <h4>{parameterOrVariable.name}</h4>
          <p>{description}</p>
        </article>
      </Link>
    )
  },
})


export default HomePage
