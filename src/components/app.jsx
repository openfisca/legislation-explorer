import React, {PropTypes} from "react"

import AppPropTypes from "../app-prop-types"
import DocumentTitle from "react-document-title"
import NavBar from "./navbar"

const App = React.createClass({
  propTypes: {
    dataByRouteName: PropTypes.object,
    errorByRouteName: PropTypes.objectOf(PropTypes.instanceOf(Error)),
    loading: AppPropTypes.loading,
    children: PropTypes.node.isRequired,
  },
  componentDidMount() {
    var timer
    global.loadingEvents.on("loadStart", () => {
      clearTimeout(timer)
      this.setState({loading: "start"})
      // For slow responses, indicate the app is thinking otherwise its fast enough to just wait for the data to load.
      timer = setTimeout(() => {
        this.setState({loading: "slow"})
      }, 300)
    })
    global.loadingEvents.on("loadEnd", () => {
      clearTimeout(timer)
      this.setState({loading: null})
    })
  },
  getInitialState() {
    return {
      loading: this.props.loading,
    }
  },
  render() {
    const {dataByRouteName, errorByRouteName} = this.props,
      loading = this.state.loading
    return (
      <DocumentTitle title="Explorateur de la législation">
        <div>
          <a className="sr-only" href="#content">Sauter au contenu principal</a>
          <NavBar />
          <div className="container" id="content" style={{marginBottom: 100}}>
            {React.cloneElement(this.props.children, {
              dataByRouteName,
              errorByRouteName,
              loading,
              })
            }
          </div>
        </div>
      </DocumentTitle>
    )
  },
})

export default App
