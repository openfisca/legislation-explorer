let config = new Object(null)

config.apiBaseUrl = process.env.API_URL || 'http://0.0.0.0:5000'
config.changelogUrl = process.env.CHANGELOG_URL

config.basename = process.env.BASENAME || '/'
config.host = process.env.HOST || '0.0.0.0'
config.port = process.env.PORT || 2030

if (process.env.MATOMO_CONFIG) {
  config.matomo = JSON.parse(process.env.MATOMO_CONFIG)
} else if (process.env.MATOMO_URL && process.env.MATOMO_SITE_ID) {
  config.matomo = {
    url: process.env.MATOMO_URL,
    siteId: process.env.MATOMO_SITE_ID,
    trackErrors: true,  // if there is a Matomo tracker, always send Legislation Explorer errors by default; if you want to override that behaviour, use the `MATOMO_CONFIG` option.
  }
}

config.ui = JSON.parse(process.env.UI_STRINGS || '{"en":{"countryName":"the development environment"},"fr":{"countryName":"l’environnement de développement"}}')


export default config
