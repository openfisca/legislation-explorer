import React from "react"
import PropTypes from 'prop-types'

const List = React.createClass({
  propTypes: {
    children: PropTypes.func,
    keyProperty: PropTypes.string,
    type: PropTypes.string,
    items: PropTypes.array.isRequired,
  },
  render() {
    const {children, keyProperty, items, type} = this.props
    return (
      <ul className={type ? `list-${type}` : null} style={{marginBottom: type === "inline" && 0}}>
        {
          items.map((item, idx) => (
            <li key={keyProperty ? item[keyProperty] : idx}>
              {children ? children(item, idx) : item}
              {type === "inline" && idx < items.length - 1 ? ", " : null}
            </li>
          ))
        }
      </ul>
    )
  },
})


export default List
