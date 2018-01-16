# OpenFisca Legislation explorer

[![CircleCI](https://circleci.com/gh/openfisca/legislation-explorer.svg?style=svg)](https://circleci.com/gh/openfisca/legislation-explorer)

## Presentation

[OpenFisca](https://www.openfisca.fr/) is a versatile microsimulation free software.

This application allows to explore the legislation with its parameters and formulas.

See https://legislation.openfisca.fr/

## Run the server

The following `npm run` commands are declared in `package.json`.

Type the following commands from the project root directory:

- Development server:

    ```sh
    npm install
    npm run dev # To use http://localhost:5000/ for the Web API
    npm run dev:prod-api # To use https://api.openfisca.fr/ for the Web API
    ```

    Open http://localhost:2030/

- Production server:

    ```sh
    npm install
    npm run clean
    npm run build
    npm start
    ```

    Open http://localhost:2030/

## Auto-update the legislation

To maintain the legislation at its latest version, you can check the [auto-update tool](https://github.com/openfisca/openfisca-ops/tree/master/auto-update-pip-packages).

## Integration tests

> Legislation Explorer integration tests are implemented with [Watai](https://github.com/MattiSG/Watai).

### Install the necessary helpers

Install [Selenium standalone server](http://www.seleniumhq.org/download/).

Install Chrome WebDriver : The `tests/config.js` in this package is pre-configured to use Chrome WebDriver.
* Under Debian GNU/Linux install it with `apt install chromium-driver` (Chromium is the free software version of Chrome).
* Under Mac OS X install it with `brew install chromedriver`

### Run the integration tests

- Terminal window 1 : run Selenium standalone server

```sh
java -jar selenium-server-standalone-3.4.0.jar
18:51:36.494 INFO - Selenium build info: version: '3.3.0', revision: 'b526bd5'
[...]
18:51:36.722 INFO - Selenium Server is up and running
```
- Terminal window 2 : run Chrome WebDriver

```sh
chromedriver
Starting ChromeDriver 2.25 (undefined) on port 9515
Only local connections are allowed.
```

- Terminal window 3 : start the application development server if not already done (`npm run dev:prod-api`).

- Terminal window 4 : run the integration tests

```sh
npm run test:integration
> legislation-explorer@0.0.1 test:integration /home/cbenz/Dev/openfisca/legislation-explorer
> watai tests

⨁  tests
✔  The header should show metadata on the loaded tax benefit system.
✔  The search should filter the list.
✔  Navigating to an item of the list should show details, going back should keep the search.
```

## OpenFisca Documentation

Please consult http://openfisca.org/doc/

## Contribute

OpenFisca is a free software project.
Its source code is distributed under the [GNU Affero General Public Licence](http://www.gnu.org/licenses/agpl.html)
version 3 or later (see COPYING).

Feel free to join the OpenFisca development team on [GitHub](https://github.com/openfisca) or contact us by email at
contact@openfisca.fr
