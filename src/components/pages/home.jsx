import {isEmpty} from "ramda"
import React, {PropTypes} from "react"
import {locationShape} from "react-router/lib/PropTypes"
import {Link} from "react-router"

import * as AppPropTypes from "../../app-prop-types"
import {findParametersAndVariables} from "../../search"
import List from "../list"


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
    this.searchInput.scrollIntoView()
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
              autoFocus={true}
              className="form-control"
              onChange={this.handleInputChange}
              placeholder="smic, salaire net…"
              ref={element => this.searchInput = element}
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
              : <SearchResults items={foundParametersAndVariables} query={query} />
          }
        </section>
      </div>
    )
  },
})

const SearchResults = React.createClass({
  propTypes: {
    items: PropTypes.array.isRequired,
    query: PropTypes.string,
  },
  shouldComponentUpdate(nextProps) {
    // Optimization: re-render this component only if `query` changed.
    // If `query` is the same than on previous rendering, it implies that `items` is the same too.
    return nextProps.query !== this.props.query
  },
  render() {
    const {items} = this.props
    return (
      <List items={items} type="unstyled">
        {parameterOrVariable => {
          const {name, type} = parameterOrVariable
          const description = type === 'parameter'
            ? parameterOrVariable.description
            : parameterOrVariable.label
          return (
            <Link key={`${name}-${type}`} to={`/${name}`}>
              <article style={{margin: "3em 0"}}>
                <h4>{name}</h4>
                {description && <p>{description}</p>}
              </article>
            </Link>
          )
        }}
      </List>
    )
  }
})


export default HomePage
