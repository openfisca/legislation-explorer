# OpenFisca Legislation explorer

A web user interface to explore an [OpenFisca](http://openfisca.org/) tax and benefit system model.

This application consumes a legislation description made available by the OpenFisca web API and makes its parameters and formulas searchable and interlinked. [Example](https://fr.openfisca.org/legislation).

## Development stack

This application is based on [Node](https://nodejs.org) on the backend and [React](https://reactjs.org) on the frontend.

In order to run the server or to improve the app, first install [Node and NPM](https://nodejs.org/en/download/) and [Git](https://git-scm.com). Then, run the following commands:

```sh
git clone https://github.com/openfisca/legislation-explorer.git
cd legislation-explorer
npm install --production
```


## Configure the deployment

You will need to tell the Legislation Explorer server where your OpenFisca API instance can be reached, as well as where your repository resides for contributors to be directed to. This is done with a configuration file.

This config file needs to expose a JavaScript object with the following properties:

- `apiBaseUrl`: The URL at which your OpenFisca API resides. For example: `https://openfisca-aotearoa.herokuapp.com`.
- `gitHubProject`: The GitHub fully qualified name of the source repository for this OpenFisca instance. For example: `ServiceInnovationLab/openfisca-aotearoa`.
- `gitWebpageUrl`: The URL at which the source repository for this OpenFisca instance can be found. For example: `https://github.com/ServiceInnovationLab/openfisca-aotearoa`.
- `websiteUrl`: The URL at which more information can be obtained on OpenFisca. For example: `https://openfisca.org`.

### Optional configuration

You can also add the following properties:

- `piwikConfig`: An object describing how to contact a [Piwik analytics](https://piwik.org) instance to which usage stats will be sent. Contains the following subproperties:
    - `url`: The base URL at which the Piwik instance can be contacted. For example: `https://stats.data.gouv.fr`.
    - `siteId`: The ID of the site to track in this Piwik instance.
    - `trackErrors`: _A Boolean value._
- `useCommitReferenceFromApi`: _A Boolean value._
- `winstonConfig`: A configuration object to pass to the [`winston` logger](https://github.com/winstonjs/winston/tree/2.x#instantiating-your-own-logger) (i.e. what is passed to a `new winston.Logger`).

Some other elements can be configured through environment variables passed to both `npm build` and `npm start`:

- `BASENAME` defines the path at which the Legislation Explorer is served. Defaults to `/`. For example: `BASENAME=/legislation` to serve on `https://fr.openfisca.org/legislation`.
- `NODE_ENV` defines if assets should be served minified or with hot module remplacement. Can be either `development` or `production`. Example: `NODE_ENV=production PORT=2030 node index.js`. Prefer using `npm start`.
- `PORT` defines the port on which the app is served. Example: `NODE_ENV=production PORT=2030 node index.js`. Prefer using `npm start`.


## Run the server

`cd` to the cloned `legislation-explorer` directory, and run the following commands:

```sh
npm run build  # compile the frontend code
npm start  # start the server
```


## Improve the app

You can edit all files in the source folder you cloned. In order to ease development, a different set of commands will allow you to run the app with hot module replacement, which will reflect your changes almost instantly rather than rebuilding the whole package.

`cd` to the cloned `legislation-explorer` directory, and run the following commands:

```sh
npm install  # install development dependencies
npm run dev # To use http://localhost:5000/ for the Web API
npm run dev:prod-api # To use https://api.openfisca.fr/ for the Web API
```

> Some additional commands can be useful for development. You can discover all of them by running `npm run`.


### Tests

This app has both unit and integration tests. Its integration tests are implemented with [Watai](https://github.com/MattiSG/Watai). You will first need to [install its Selenium WebDriver dependencies](https://github.com/MattiSG/Watai/wiki/Installing) to run these tests.

Then, build the app, [run the server](#run-the-server), [run a Selenium instance](https://github.com/MattiSG/Watai/wiki/Installing#selenium-server) and, in another Terminal, run:

```sh
npm run test
```
