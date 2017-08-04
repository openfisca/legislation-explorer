import {isEmpty} from "ramda"
import React, {PropTypes} from "react"
import {Link, locationShape, routerShape} from "react-router"
import {FormattedMessage} from "react-intl"

import * as AppPropTypes from "../../app-prop-types"
import List from "../list"

import config from "../../config"
export const searchInputId = "search-input"

const HomePage = React.createClass({
  contextTypes: {
    router: routerShape.isRequired,
    searchQuery: PropTypes.string.isRequired,
    searchResults: PropTypes.array.isRequired,
    setSearchQuery: PropTypes.func.isRequired,
  },
  propTypes: {
    countryPackageName: PropTypes.string.isRequired,
    countryPackageVersion: PropTypes.string.isRequired,
    location: locationShape.isRequired,
    parameters: PropTypes.objectOf(AppPropTypes.parameter).isRequired,
    variables: PropTypes.objectOf(AppPropTypes.variable).isRequired,
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
    const searchQuery = ""
    this.setState({inputValue: searchQuery})
    this.setState({source: "search"})
    this.context.setSearchQuery(searchQuery)
    this.context.router.push({
      query: {q: searchQuery},
      hash: `#${searchInputId}`,
    })
  },
  handleInputChange(event) {
    this.setState({inputValue: event.target.value})
    this.setState({source: "search"})
    // Use scrollIntoView before pushing searchInputId in the hash, to scroll after the first character is typed.
    this.searchInput.scrollIntoView()
  },
  handleSubmit(event) {
    event.preventDefault()
    this.context.setSearchQuery(this.state.inputValue)
    this.context.router.push({
      query: {q: this.state.inputValue},
      hash: `#${searchInputId}`,
    })
    this.setState({source: "search"})
  },
  locationHasChanged(location) {
    const {router} = this.context
    const oldLocation = this.props.location
    // Check that the new location stays on the Home page, to avoid overwriting searchQuery in App state.
    if (this._isMounted && router.isActive(oldLocation)) {
      const searchQuery = location.query.q || ""
      const sourceOfQuery = location.query.source || ""
      this.context.setSearchQuery(searchQuery)
      this.setState({inputValue: searchQuery})
      this.setState({source: sourceOfQuery})
    }
  },
  render() {
    const inputValue = this.state.inputValue
    const source = this.state.source
    const {searchQuery, searchResults} = this.context
    const countryPackageName = this.props.countryPackageName
    const changelogURL = `https://www.github.com/${config.gitHubProject}/blob/master/CHANGELOG.md`
    return (
      <div>
        {source == "404" &&
            <div className="alert alert-info" id="not-found">
            <h4 >
              <FormattedMessage id = "pageDoesNotExist" values=
              {{inputValueRef:`${inputValue}`}}/>
            </h4>
            <p>
              <FormattedMessage id = "notParamNotVariable" values=
              {{inputValueRef:`${inputValue}`}}/>
            </p>
            <p>
              <FormattedMessage id = "checkChangelog" values=
              {{changelogURLLink:
                <a href = {changelogURL} target = "_blank">changelog</a>
              }}/>
            </p>
          </div>
          }
        <form onSubmit={this.handleSubmit}>
          <div className="input-group input-group-lg" style={{margin: "2em 0"}}>
            <input
              autoFocus={true}
              className="form-control"
              id="search-input"
              onChange={this.handleInputChange}
              placeholder="smic, salaire net…"
              ref={element => this.searchInput = element}
              type="text"
              value={inputValue}
            />
            <div className="input-group-btn">
              {
                !isEmpty(searchQuery) && (
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
              <button className="btn btn-primary" type="submit"><FormattedMessage id = "find"/></button>
            </div>
          </div>
        </form>
        <section>
          {
            isEmpty(searchResults)
              ? <h4>Aucun résultat</h4>
              : <SearchResults items={searchResults} searchQuery={searchQuery} />
          }
        </section>
      </div>
    )
  },
})

const SearchResults = React.createClass({
  propTypes: {
    items: PropTypes.array.isRequired,
    searchQuery: PropTypes.string,
  },
  shouldComponentUpdate(nextProps) {
    // Optimization: re-render this component only if `searchQuery` changed.
    // If `searchQuery` is the same than on previous rendering, it implies that `items` is the same too.
    return nextProps.searchQuery !== this.props.searchQuery
  },
  render() {
    const {items} = this.props
    return (
      <List items={items} type="unstyled">
        {item => {
          const {description, itemType, name} = item
          return (
            <Link key={`${name}-${itemType}`} to={`/${name}`}>
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
