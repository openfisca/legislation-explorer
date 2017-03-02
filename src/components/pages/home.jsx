import {isEmpty} from "ramda"
import React, {PropTypes} from "react"
import {Link, locationShape, routerShape} from "react-router"

import * as AppPropTypes from "../../app-prop-types"
import List from "../list"

export const searchInputId = "search-input"

const HomePage = React.createClass({
  contextTypes: {
    query: PropTypes.string.isRequired,
    router: routerShape.isRequired,
    searchResults: PropTypes.array.isRequired,
    setQuery: PropTypes.func.isRequired,
  },
  propTypes: {
    countryPackageName: PropTypes.string.isRequired,
    countryPackageVersion: PropTypes.string.isRequired,
    location: locationShape.isRequired,
    parameters: PropTypes.arrayOf(AppPropTypes.parameterOrScale).isRequired,
    variables: PropTypes.arrayOf(AppPropTypes.variable).isRequired,
  },
  componentDidMount() {
    this._isMounted = true
    const {router} = this.context
    this.unregisterRouterListen = router.listen(this.locationHasChanged)
  },
  componentWillUnmount() {
    this._isMounted = false
    this.unregisterRouterListen()
  },
  getInitialState() {
    return {inputValue: ""}
  },
  handleClearSearchClicked() {
    const query = ""
    this.setState({inputValue: query})
    this.context.setQuery(query)
    this.context.router.push(query)
  },
  handleInputChange(event) {
    this.setState({inputValue: event.target.value})
    this.searchInput.scrollIntoView()
  },
  handleSubmit(event) {
    event.preventDefault()
    this.context.setQuery(this.state.inputValue)
    this.context.router.push(`?q=${this.state.inputValue}#${searchInputId}`)
  },
  locationHasChanged(nextLocation) {
    const {location} = this.props
    // Check that the new location stays on the Home page, to avoid overwriting the query in App state.
    if (this._isMounted && location.pathname === nextLocation.pathname) {
      const query = nextLocation.query.q || ""
      this.context.setQuery(query)
      this.setState({inputValue: query})
    }
  },
  render() {
    const {inputValue} = this.state
    const {query, searchResults} = this.context
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <div className="input-group input-group-lg" style={{margin: "2em 0"}}>
            <input
              autoFocus={true}
              className="form-control"
              id={searchInputId}
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
              <button className="btn btn-primary" type="submit">Trouver</button>
            </div>
          </div>
        </form>
        <section>
          {
            isEmpty(searchResults)
              ? <h4>Aucun résultat</h4>
              : <SearchResults items={searchResults} query={query} />
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
          const {description, itemType, label, name} = parameterOrVariable
          const displayedDescription = itemType === 'parameter' ? description : label
          return (
            <Link key={`${name}-${itemType}`} to={`/${name}`}>
              <article style={{margin: "3em 0"}}>
                <h4>{name}</h4>
                {displayedDescription && <p>{displayedDescription}</p>}
              </article>
            </Link>
          )
        }}
      </List>
    )
  }
})


export default HomePage
