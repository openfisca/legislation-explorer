import classNames from "classnames"
import React, {PropTypes} from "react"


const Collapse = React.createClass({
  propTypes: {
    children: PropTypes.node.isRequired,
    title: PropTypes.node.isRequired,
  },
  getInitialState() {
    return {
      opened: false,
    }
  },
  handleTitleClick(event) {
    event.preventDefault()
    const {opened} = this.state
    this.setState({opened: !opened})
  },
  render() {
    const {children, title} = this.props
    const {opened} = this.state
    return (
      <div>
        <div style={{marginBottom: "2em"}}>
          <a href="#" onClick={this.handleTitleClick}>
            <span
              aria-hidden="true"
              className={classNames("glyphicon", opened ? "glyphicon-triangle-bottom" : "glyphicon-triangle-right")}
              style={{display: "inline-block", marginRight: "0.5em"}}
            ></span>
            {React.cloneElement(title, {style: {display: "inline-block"}})}
          </a>
        </div>
        {opened && children}
      </div>
    )
  },
})


export default Collapse
