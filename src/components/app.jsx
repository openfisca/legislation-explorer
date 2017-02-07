import DocumentTitle from "react-document-title"
import React, {PropTypes} from "react"


const App = React.createClass({
  propTypes: {
    children: PropTypes.node.isRequired,
  },
  render() {
    return (
      <DocumentTitle title="Explorateur de la législation">
        <div>
          <a className="sr-only" href="#content">Sauter au contenu principal</a>
          <div className="container" id="content" style={{marginBottom: 100}}>
            {this.props.children}
          </div>
        </div>
      </DocumentTitle>
    )
  },
})

export default App
