import compression from "compression";
import express from "express";
import favicon from "serve-favicon";
import morgan from "morgan";
import path from "path";

import render from "./server/render";


const server = express();

server.use(morgan(server.get("env") === "production" ? "combined" : "dev"));
server.use(compression());
server.use(favicon(path.resolve(__dirname, "./assets/favicon.png")));

// Use the public directory for static files.
// This directory is created by webpack on build time (npm run build).
// On development it serves assets like bootstrap CSS, on production it serves the bundled JS too.
server.use(express.static(path.resolve(__dirname, "../public")));

// On development, serve the static files from the webpack dev server.
if (server.get("env") === "development") {
  require("../webpack/server");
}

// Render the app server-side and send it as response
server.use(render);

// Generic server errors (e.g. not caught by components)
server.use((err, req, res/*, next*/) => {
  console.log("Error on request %s %s", req.method, req.url);
  console.log(err);
  console.log(err.stack);
  res.status(500).send("Something bad happened");
});

server.set("port", process.env.PORT || 2030);

server.listen(server.get("port"), () => {
  console.log(`Express ${server.get("env")} server listening on ${server.get("port")}`);
});
