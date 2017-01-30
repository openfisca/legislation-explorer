import React, {PropTypes} from "react"


const SearchBox = React.createClass({
  propTypes: {
    labelFilter: PropTypes.string,
    nameFilter: PropTypes.string,
    onLabelChange: PropTypes.func,
    onNameChange: PropTypes.func,
  },
  onLabelInputChange(event) {
    this.props.onLabelChange(event.target.value)
  },
  onNameInputChange(event) {
    this.props.onNameChange(event.target.value)
  },
  render() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">Recherche</h3>
        </div>
        <div className="panel-body">
          <div className="form-group">
            <label htmlFor="search-box-name">
              Nom
            </label>
            <input
              className="form-control"
              id="search-box-name"
              onChange={this.onNameInputChange}
              placeholder="Nom"
              value={this.props.nameFilter}
            />
          </div>
          <div className="form-group">
            <label htmlFor="search-box-label">
              Label
            </label>
            <input
              className="form-control"
              id="search-box-label"
              onChange={this.onLabelInputChange}
              placeholder="Label"
              value={this.props.labelFilter}
            />
          </div>
        </div>
      </div>
    )
  },
})


export default SearchBox
