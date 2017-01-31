import React, {PropTypes} from "react"


const SearchBox = React.createClass({
  propTypes: {
    query: PropTypes.string,
    onQueryChange: PropTypes.func,
  },
  handleSubmit(event) {
    event.preventDefault();
    this.props.onQueryChange(this.input.value)
  },
  render() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">Recherche</h3>
        </div>
        <div className="panel-body">
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label htmlFor="search-box-input">
                Nom
              </label>
              <input
                className="form-control"
                defaultValue={this.props.query}
                id="search-box-input"
                placeholder="Nom"
                ref={(input) => this.input = input}
              />
            </div>
            <button className="btn btn-primary">Rechercher</button>
          </form>
        </div>
      </div>
    )
  },
})


export default SearchBox
