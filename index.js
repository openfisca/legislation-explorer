// Register babel to have ES6 support on the server

require("babel/register");


// Polyfill, loaded at the very first.

function loadPolyfillForLocales(localesMyAppSupports) {
  // From http://formatjs.io/guides/runtime-environments/#server
  if (global.Intl) {
    // Determine if the built-in `Intl` has the locale data we need.
    var hasBuiltInLocaleData = localesMyAppSupports.every(function (locale) {
      return Intl.NumberFormat.supportedLocalesOf(locale)[0] === locale &&
        Intl.DateTimeFormat.supportedLocalesOf(locale)[0] === locale;
    });
    if (!hasBuiltInLocaleData) {
      // `Intl` exists, but it doesn't have the data we need, so load the
      // polyfill and replace the constructors with need with the polyfill's.
      var IntlPolyfill = require("intl");
      Intl.NumberFormat = IntlPolyfill.NumberFormat;
      Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;
    }
  } else {
    // No `Intl`, so use and load the polyfill.
    global.Intl = require("intl");
  }
}

loadPolyfillForLocales(["fr-FR"]);


// Start the server app

require("./src/server");
