import {IntlMixin} from "react-intl"
import {RouteHandler} from "react-router"
import React, {PropTypes} from "react"

import AppPropTypes from "../app-prop-types"
import Layout from "./layout"


var App = React.createClass({
  mixins: [IntlMixin],
  propTypes: {
    dataByRouteName: PropTypes.object,
    errorByRouteName: PropTypes.objectOf(PropTypes.instanceOf(Error)),
    loading: AppPropTypes.loading,
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
    return (
      <Layout>
        <RouteHandler
          dataByRouteName={this.props.dataByRouteName}
          errorByRouteName={this.props.errorByRouteName}
          loading={this.state.loading}
        />
      </Layout>
    )
  },
})


export default App
