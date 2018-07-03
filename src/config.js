// Load different configurations (for development, production, etc).
let configFilename = process.env.NODE_ENV || 'development'
if (process.env.NODE_ENV == 'production') {
  configFilename += '.' + (process.env.COUNTRY_PRODUCTION_CONFIG || 'france')
}
if (process.env.NODE_ENV == 'test') {
  configFilename = 'development'
}
const config = require('../config/' + configFilename).default

config.host = process.env.HOST || '0.0.0.0'
config.port = process.env.PORT || 2030
config.apiBaseUrl = process.env.API_URL || config.apiBaseUrl
config.changelogUrl = process.env.CHANGELOG_URL || config.changelogUrl

if (process.env.MATOMO_CONFIG) {
  config.matomo = JSON.parse(process.env.MATOMO_CONFIG)
} else if (process.env.MATOMO_URL && process.env.MATOMO_SITE_ID) {
  config.matomo = {
    url: process.env.MATOMO_URL,
    siteId: process.env.MATOMO_SITE_ID,
    trackErrors: true,  // if there is a Matomo tracker, always send Legislation Explorer errors by default; if you want to override that behaviour, use the `MATOMO_CONFIG` option.
  }
}


export default config
