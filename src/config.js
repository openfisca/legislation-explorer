// Load different configurations (for development, production, etc).
const configFilename = process.env.NODE_ENV || "development"
const config = require("../config/" + configFilename).default
export default config
