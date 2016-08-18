const intlData = {
  formats: {
    date: {
      short: {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      },
    },
  },
  locales: "fr-FR",
}


// shim for Intl needs to be loaded dynamically
// so we callback when we're done to represent
// some kind of "shimReady" event
function polyfillIntl(callback) {
  if (!window.Intl) {
    require(["intl/dist/Intl", "intl/locale-data/json/fr-FR.json"], ({Intl}, frJson) => {
      Intl.__addLocaleData(frJson) // eslint-disable-line no-underscore-dangle
      window.Intl = Intl
      callback()
    })
  } else {
    process.nextTick(callback)
  }
}


export {intlData, polyfillIntl}
