import { routerShape } from 'react-router'
import React from 'react'
import {FormattedMessage, injectIntl, intlShape} from 'react-intl'

import { searchInputId } from './home'

class SearchBar extends React.Component {
  static contextTypes = {
    router: routerShape.isRequired,
  }

  static propTypes = {
    intl: intlShape.isRequired
  }

  state = {inputValue: this.props.initialValue};

  handleInputChange = (event) => {
    this.setState({inputValue: event.target.value})
    this.searchInput.scrollIntoView()
  };

  handleSubmit = (event) => {
    event.preventDefault()
    this.props.onSubmit(this.state.inputValue)
  }

  componentDidUpdate(prevProps) {
    if (this.props.initialValue != prevProps.initialValue) {
      this.setState({inputValue: this.props.initialValue})
    }
  }

  render() {
    const inputValue = this.state.inputValue
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <div className="input-group input-group-lg" style={{margin: '2em 0'}}>
            <input
              className="form-control"
              id={searchInputId}
              placeholder={this.props.intl.formatMessage({ id: 'search_placeholder' }) + '…'}
              type="text"
              onChange={this.handleInputChange}
              value={inputValue}
              ref={element => this.searchInput = element}
            />
            <div className="input-group-btn">
              <button className="btn btn-primary" type="submit" ><FormattedMessage id="find"/></button>
            </div>
          </div>
        </form>
      </div>
    )
  }
}



export default injectIntl(SearchBar)
