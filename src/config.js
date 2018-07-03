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


export default config
