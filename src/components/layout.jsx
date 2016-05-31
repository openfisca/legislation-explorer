
import React, {PropTypes} from "react"



var Layout = React.createClass({
  propTypes: {
    children: PropTypes.node.isRequired,
  },
  render() {
    return (
      <DocumentTitle title="Explorateur de la législation">
        <div>
          <a className="sr-only" href="#content">Sauter au contenu principal</a>
          <NavBar />
          <div className="container" id="content" style={{marginBottom: 100}}>
            {this.props.children}
          </div>
        </div>
      </DocumentTitle>
    )
  },
})


export default Layout
