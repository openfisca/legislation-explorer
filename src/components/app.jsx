/*
OpenFisca -- A versatile microsimulation software
By: OpenFisca Team <contact@openfisca.fr>

Copyright (C) 2011, 2012, 2013, 2014, 2015 OpenFisca Team
https://github.com/openfisca

This file is part of OpenFisca.

OpenFisca is free software; you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

OpenFisca is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/


import {RouteHandler} from "react-router";
import React, {PropTypes} from "react/addons";

import Layout from "./layout";


var App = React.createClass({
  contextTypes: {
    router: PropTypes.func,
  },
  propTypes: {
    loading: PropTypes.bool,
  },
  componentDidMount() {
    var timer;
    global.loadingEvents.on("loadStart", () => {
      clearTimeout(timer);
      this.setState({loading: "start"});
      // For slow responses, indicate the app is thinking otherwise its fast enough to just wait for the data to load.
      timer = setTimeout(() => {
        this.setState({loading: "slow"});
      }, 300);
    });
    global.loadingEvents.on("loadEnd", () => {
      clearTimeout(timer);
      this.setState({loading: null});
    });
  },
  getInitialState() {
    return {
      loading: this.props.loading,
    };
  },
  render() {
    return (
      <Layout>
        <RouteHandler {...this.props} appState={this.state} />
      </Layout>
    );
  },
});


export default App;
