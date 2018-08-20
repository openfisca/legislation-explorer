import {isEmpty} from 'ramda'
import React from 'react'
import PropTypes from 'prop-types'
import {Link, locationShape, routerShape} from 'react-router'
import {FormattedMessage, injectIntl, intlShape} from 'react-intl'
import DocumentTitle from 'react-document-title'

import { parameterShape, variableShape } from '../../openfisca-proptypes'
import List from '../list'
import config from '../../config'
import SearchBarComponent from './searchbar'
export const searchInputId = 'search-input'

class HomePage extends React.Component {
  static contextTypes = {
    router: routerShape.isRequired,
    searchQuery: PropTypes.string.isRequired,
    searchResults: PropTypes.array.isRequired,
    setSearchQuery: PropTypes.func.isRequired,
  };

  static propTypes = {
    countryPackageName: PropTypes.string.isRequired,
    countryPackageVersion: PropTypes.string.isRequired,
    intl: intlShape,
    location: locationShape.isRequired,
    parameters: PropTypes.objectOf(parameterShape).isRequired,
    variables: PropTypes.objectOf(variableShape).isRequired,
  };

  state = {inputValue: ''};

  componentDidMount() {
    this._isMounted = true
    const {router} = this.context
    this.unregisterRouterListen = router.listen(this.locationHasChanged)
  }

  componentWillUnmount() {
    this._isMounted = false
    this.unregisterRouterListen()
  }

  locationHasChanged = (location) => {
    if (this._isMounted) {
      let searchQuery = ''
      if (location.query.q) {
        searchQuery = location.query.q
      }

      if (searchQuery) {
        this.context.setSearchQuery(searchQuery)
      }
      this.setState({inputValue: searchQuery})
      this.setState({is404: location.query.is404})
    }
  };

  render() {
    const inputValue = this.state.inputValue
    const is404 = this.state.is404
    const {searchQuery, searchResults} = this.context
    return (
      <DocumentTitle title={(is404 ? this.props.intl.formatMessage({ id: 'elementNotFound' }) + ' — ' : '') + this.props.intl.formatMessage({ id: 'appName' })}>
        <div>
          {is404 &&
            <div className="alert alert-info" id="not-found">
              <h4>
                <FormattedMessage
                  id="pageDoesNotExist"
                  values={{inputValueRef: inputValue}}
                />
              </h4>
              <p>
                <FormattedMessage
                  id="notParamNotVariable"
                  values={{inputValueRef: inputValue}}
                />
              </p>
              <p>
                <FormattedMessage
                  id="checkChangelog"
                  values={{changelogURLLink: <a href={config.changelogURL} rel="noopener" target="_blank">changelog</a>}}
                />
              </p>
            </div>
          }
          <SearchBarComponent initialValue={inputValue}/>
          <section>
            {
              isEmpty(searchResults)
                ? <h4>
                    <FormattedMessage id="noResultsFor"
                      values={{
                        input: <code>{inputValue}</code>
                      }}
                    />
                  </h4>
                : <SearchResults items={searchResults} searchQuery={searchQuery} />
            }
          </section>
        </div>
      </DocumentTitle>
    )
  }
}

class SearchResults extends React.Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
    searchQuery: PropTypes.string,
  };

  shouldComponentUpdate(nextProps) {
    // Optimization: re-render this component only if `searchQuery` changed.
    // If `searchQuery` is the same than on previous rendering, it implies that `items` is the same too.
    return nextProps.searchQuery !== this.props.searchQuery
  }

  render() {
    const {items} = this.props
    return (
      <List items={items} type="unstyled">
        {item => {
          const {description, itemType, name} = item
          return (
            <Link key={`${name}-${itemType}`} to={`/${name}`}>
              <article style={{margin: '3em 0'}}>
                <h4>{name}</h4>
                {description && <p>{description}</p>}
              </article>
            </Link>
          )
        }}
      </List>
    )
  }
}


export default injectIntl(HomePage)
