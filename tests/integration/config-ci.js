// this file is for use in CircleCI continuous integration environment

var capabilities = [
  {browserName: 'chrome'},
  {browserName: 'firefox'},
  {browserName: 'internet explorer'},
  {
    deviceName: 'Samsung Galaxy S6 GoogleAPI Emulator',
    browserName: 'Chrome',
    platformName: 'Android',
    platformVersion: '7.0'
  }
  ][process.env.CIRCLE_NODE_INDEX];

module.exports = {
  seleniumServerURL: {
    hostname: 'ondemand.saucelabs.com',
    port: 80
  },
  driverCapabilities: Object.assign({},
    capabilities,
    {'tunnel-identifier': 'circle-' + process.env.CIRCLE_BUILD_NUM + '-' + process.env.CIRCLE_NODE_INDEX}
  ),
  tags: [ 'circle-ci', '#' + process.env.CIRCLE_BUILD_NUM ],
  views: [ 'Verbose', 'SauceLabs' ],
  quit: 'always', // avoid wasting 90 seconds on SauceLabs
  bail: true,
  build: 'CircleCI#' + process.env.CIRCLE_BUILD_NUM
}
