import React, {PropTypes} from "react"


const SearchBox = React.createClass({
  propTypes: {
    query: PropTypes.string,
    onQueryChange: PropTypes.func,
  },
  onInputChange(event) {
    this.props.onQueryChange(event.target.value)
  },
  render() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">Recherche</h3>
        </div>
        <div className="panel-body">
          <div className="form-group">
            <label htmlFor="search-box-input">
              Nom ou libellé
            </label>
            <input
              className="form-control"
              id="search-box-input"
              onChange={this.onInputChange}
              placeholder="Nom"
              value={this.props.query}
            />
          </div>
        </div>
      </div>
    )
  },
})


export default SearchBox
