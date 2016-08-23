// Load polyfills, before running the server
require("babel-polyfill")

// Register babel to have ES6 support on the server
require("babel-register")

// Intl in node
// const areIntlLocalesSupported = require("intl-locales-supported")

// if (global.Intl) {
//   // Determine if the built-in `Intl` has the locale data we need.
//   if (!areIntlLocalesSupported(["fr-FR"])) {
//       // `Intl` exists, but it doesn't have the data we need, so load the
//       // polyfill and patch the constructors we need with the polyfill's.
//       const IntlPolyfill = require("intl")
//       Intl.NumberFormat = IntlPolyfill.NumberFormat
//       Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat
//   }
// } else {
//   // No `Intl`, so use and load the polyfill.
//   global.Intl = require("intl")
// }

// Force Intl to be polyfilled because NodeJS French date format does not use padding (1/1/2016)
// whereas npm intl module does (01/01/2016). This leads to DOM mismatch between server and client in React.
global.Intl = require("intl")

const hljs = require("highlight.js/lib/highlight")
hljs.registerLanguage("python", require("highlight.js/lib/languages/python"))

// Start the server app

if (process.env.NODE_ENV === "production" || require("piping")({
  hook: true,
  ignore: /(\/\.|~$|webpack-assets.json)/,
})) {
  require("./src/server/index.js")
}
