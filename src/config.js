// Load different configurations (for development, production, etc).
let configFilename = process.env.NODE_ENV || "development"
if (process.env.NODE_ENV === "production") {
    configFilename += '.' + (process.env.COUNTRY_PRODUCTION_CONFIG || "france")
}
const config = require("../config/" + configFilename).default
export default config
