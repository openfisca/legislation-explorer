# OpenFisca Legislation explorer

A web user interface to explore an [OpenFisca](https://openfisca.org/) tax and benefit system.

This application consumes a legislation description made available by the OpenFisca web API and makes its parameters and formulas searchable and interlinked. [Example](https://fr.openfisca.org/legislation).


## Development stack

This application is based on [Node](https://nodejs.org) on the backend and [React](https://reactjs.org) on the frontend.

In order to run the server or to improve the app, first install [Node and NPM](https://nodejs.org/en/download/) and [Git](https://git-scm.com). Then, run the following commands:

```sh
git clone https://github.com/openfisca/legislation-explorer.git
cd legislation-explorer
npm install --production
```


## Configure your instance

You will need to tell the Legislation Explorer server where your OpenFisca API instance can be reached, as well as where your repository resides for contributors to be directed to. This is all done through environment variables, allowing you to use the same code for any instance by [injecting these elements at runtime](https://12factor.net/config).

To set these options, you need to define them by prefixing the `npm start` or `npm run dev` commands with their definitions, in the `$NAME=$VALUE` syntax.

- `API_URL`: the URL at which your OpenFisca API root endpoint can be found. For example: `https://openfisca-aotearoa.herokuapp.com`. Defaults to `http://0.0.0.0:5000`.
- `CHANGELOG_URL`: the URL at which the changelog for the country package can be found. Used on 404 pages. For example: `https://github.com/openfisca/openfisca-tunisia/blob/master/CHANGELOG.md`.

> If it gets lengthy or you want to persist these values, you can also use a `.env` file.
> Such a file is a plaintext file with name `.env` stored in the root directory of your legislation explorer instance (i.e. next to the `package.json` file). List all of your environment variables in the `$NAME=$VALUE` syntax, one per line. If you have trouble writing this file, read the [parsing rules](https://github.com/motdotla/dotenv#rules).
> An example file is provided as `.env.example`, setting default values. You can copy it, but changing it won't have any impact: only a file named `.env` will be taken into account. You should not commit this file: it depends on each instance.


### Localisation (l12n / i18n)

The user interface of the legislation explorer has full support for internationalisation. Supported languages can be found in the `src/assets/lang` directory, and can be added by simply creating a new file with the two-letter language code to add support for.

For localisation, you can override any of the strings defined in these files through the `UI_STRINGS` environment variable.

- `UI_STRINGS`: overrides the `ui` config object through a JSON string. Example: `UI_STRINGS='{"en":{"countryName":"Tunisia"},"fr":{"countryName":"Tunisie"}}' npm start`.

The value is a JSON-encoded object whose keys are ISO two-letters language codes and values are strings, these values will take precedence over any strings defined in the `lang` folder.

The following strings are strongly recommended to be overridden:

- `countryName`: The name of the tax and benefit system you are modelling here.
    - `forCountry`: In case the default interpolation for your `countryName` does not give good results, you can also edit the prefix added before the `countryName` value.
- `search_placeholder`: One or two suggested searches, preferably comma-separated, for your users to make sense of the search field. Best results will be obtained by using the most well-known parameters for your tax and benefit system.


### Analytics

This web app supports [Matomo](https://matomo.org) (ex-Piwik) analytics out of the box. To set it up, use the following environment variables:

- `MATOMO_URL`: he base URL at which the Matomo instance can be contacted. For example: `MATOMO_URL=https://stats.data.gouv.fr MATOMO_SITE_ID=4 npm start`. Only taken into account if used in conjunction with `MATOMO_SITE_ID` and if `MATOMO_CONFIG` is not defined.
- `MATOMO_SITE_ID`: The ID of the site to track in this Matomo instance. For example: `MATOMO_URL=https://stats.data.gouv.fr MATOMO_SITE_ID=4 npm start`. Only taken into account if used in conjunction with `MATOMO_URL` and if `MATOMO_CONFIG` is not defined.
- `MATOMO_CONFIG`: a JSON-encoded object describing how to contact your Matomo instance. The value is a [configuration object for the `piwik-react-router`](https://github.com/joernroeder/piwik-react-router#options) package (make sure to read its docs for the version specified in `package.json`). Defaults to not sending analytics at all. Example: `'MATOMO_CONFIG='{"url":"https://stats.data.gouv.fr","siteId":4}' npm start`.


### Server and public URL

- `PATHNAME` defines the path at which the Legislation Explorer is served. Defaults to `/`. For example: `PATHNAME=/legislation` to serve on `https://fr.openfisca.org/legislation`.
- `HOST`: defines the host on which the app is served. Example: `HOST=192.168.1.1 npm start`. Defaults to `0.0.0.0` (all local interfaces).
- `PORT` defines the port on which the app is served. Example: `PORT=80 npm start`. Defaults to `2030`.


### Development-specific options

- `NODE_ENV` defines if assets should be served minified or with hot module remplacement. Can be either `development` or `production`. Example: `NODE_ENV=production PORT=2030 node index.js`. Prefer using `npm start`.
- `WEBPACK_HOST`: sets the host to which `webpack-dev-server` will be bound. Defaults to `localhost`.
- `WEBPACK_PORT`: sets the port on which `webpack-dev-server` will be bound. Defaults to `2031`.


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
```

> Some additional commands can be useful for development. You can discover all of them by running `npm run`.


### Tests

This app has both unit and integration tests. Its integration tests are implemented with [Watai](https://github.com/MattiSG/Watai). You will first need to [install its Selenium WebDriver dependencies](https://github.com/MattiSG/Watai/wiki/Installing) to run these tests.

Then, build the app, [run the server](#run-the-server), [run a Selenium instance](https://github.com/MattiSG/Watai/wiki/Installing#selenium-server) and, in another Terminal, run:

```sh
npm run test
```
