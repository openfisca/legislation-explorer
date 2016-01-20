import classNames from "classnames";
import React, {PropTypes} from "react";


var Dropdown = React.createClass({
  propTypes: {
    className: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({
      disabled: PropTypes.bool,
      onSelect: PropTypes.func.isRequired,
      text: PropTypes.string.isRequired,
      title: PropTypes.string,
    })).isRequired,
  },
  getInitialState() {
    return {
      opened: false,
    };
  },
  handleBackgroundClick(event) {
    event.preventDefault();
    this.setState({opened: false});
  },
  handleDropdownClick() {
    const {opened} = this.state;
    this.setState({opened: !opened});
  },
  handleOtherItemClick(event, item) {
    event.preventDefault();
    if (!item.disabled) {
      this.setState({opened: false}, item.onSelect);
    }
  },
  render() {
    const {opened} = this.state;
    const {className, items} = this.props;
    const [firstItem, ...otherItems] = items;
    return (
      <span className={classNames(className, opened && "open")}>
        <button
          className="btn btn-default"
          onClick={firstItem.onSelect}
          title={firstItem.title}
          type="button"
        >
          {firstItem.text}
        </button>
        {
          otherItems.length && (
            <button
              aria-expanded={opened}
              aria-haspopup
              className="btn btn-default dropdown-toggle"
              onClick={this.handleDropdownClick}
              type="button"
            >
              <span className="caret"></span>
              <span className="sr-only">Toggle Dropdown</span>
            </button>
          )
        }
        {
          (otherItems.length && opened) && (
            <a href="#" onClick={this.handleBackgroundClick} style={{
              bottom: 0,
              left: 0,
              position: "fixed",
              right: 0,
              top: 0,
              zIndex: 1,
            }}></a>
          )
        }
        {
          otherItems.length && (
            <ul className="dropdown-menu dropdown-menu-right">
              {
                otherItems.map((item, idx) => (
                  <li className={classNames(item.disabled && "disabled")} key={idx}>
                    <a
                      href="#"
                      onClick={event => this.handleOtherItemClick(event, item)}
                      style={{zIndex: opened ? 2 : null}}
                      title={item.title}
                    >
                      {item.text}
                    </a>
                  </li>
                ))
              }
            </ul>
          )
        }
      </span>
    );
  },
});


export default Dropdown;
