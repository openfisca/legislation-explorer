import { Link, routerShape } from "react-router"
import React, {PropTypes} from "react"
import {FormattedMessage} from "react-intl"

import { searchInputId } from "./home"

const SearchBarComponent = React.createClass({
  contextTypes: {
    router: routerShape.isRequired,
    searchQuery: PropTypes.string.isRequired,
  },

  getInitialState() {
    return {inputValue: this.context.searchQuery}
  },

  handleInputChange(event) {
    this.setState({inputValue: event.target.value})
    this.searchInput.scrollIntoView()
  },

  handleSubmit(event) {
    event.preventDefault()
    this.context.router.push({
      query: {q: this.state.inputValue},
      hash: `#search-input`,
    })
  },

  render() {
    const inputValue = this.state.inputValue
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <div className="input-group input-group-lg" style={{margin: "2em 0"}}>
            <input
              className="form-control"
              id={searchInputId}
              placeholder="smic, salaire net…"
              type="text"
              onChange={this.handleInputChange}
              value = {inputValue}
              ref={element => this.searchInput = element}
            />
            <div className="input-group-btn">
              <button className="btn btn-primary" type="submit" ><FormattedMessage id = "find"/></button>
            </div>
          </div>
        </form>
      </div>
    )
  },
})

export default SearchBarComponent
