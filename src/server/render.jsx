// Express middleware to render the app server-side and expose its state
// to the client

import React from "react";
import Router from "react-router";

import HtmlDocument from "./HtmlDocument";
import {fetchData, routes} from "../routes";


const debug = require("debug")("app:render");
let webpackStats;

if (process.env.NODE_ENV === "production") {
  webpackStats = require("./webpack-stats.json");
}


function render(req, res, next) {
  if (process.env.NODE_ENV === "development") {
    webpackStats = require("./webpack-stats.json");
    // Do not cache webpack stats: the script file would change since
    // hot module replacement is enabled in the development env
    delete require.cache[require.resolve("./webpack-stats.json")];
  }

  Router.run(routes, req.url, (Handler, state) => {
    fetchData(state.routes, state.params, state.query)
      .then(
        data => React.renderToString(<Handler loading={false} {...data} />),
        errors => {
          debug("errors", errors);
          return React.renderToString(<Handler errors={errors} loading={false} />);
        }
      ).then(markup => {
        // The application component is rendered to static markup and sent as response.
        const css = webpackStats.css.concat([
          process.env.NODE_ENV === "production" ?
            "/assets/bootstrap/css/bootstrap.min.css" :
            "/assets/bootstrap/css/bootstrap.css",
        ]);
        const scripts = webpackStats.script.concat(
          process.env.NODE_ENV === "production" ?
            [
              "/assets/jquery/jquery.min.js",
              "/assets/bootstrap/js/bootstrap.min.js",
            ] : [
              "/assets/jquery/jquery.js",
              "/assets/bootstrap/js/bootstrap.js",
            ]
        );
        const html = React.renderToStaticMarkup(
          <HtmlDocument css={css} markup={markup} scripts={scripts} />
        );
        const doctype = "<!DOCTYPE html>";
        res.send(doctype + html);
      }).catch(error => next(error));
  });
}


export default render;
