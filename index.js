// Load polyfills, before running the server

require("babel-polyfill")

// Register babel to have ES6 support on the server
require("babel-register")

// Intl in node
const areIntlLocalesSupported = require("intl-locales-supported")

if (global.Intl) {

  // Determine if the built-in `Intl` has the locale data we need.
  if (!areIntlLocalesSupported(["fr-FR"])) {
      // `Intl` exists, but it doesn't have the data we need, so load the
      // polyfill and patch the constructors we need with the polyfill's.
      const IntlPolyfill = require("intl")
      Intl.NumberFormat = IntlPolyfill.NumberFormat
      Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat
  }
} else {
  // No `Intl`, so use and load the polyfill.
  global.Intl = require("intl")
}

// Start the server app

require("./src/server")
