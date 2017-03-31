// this file is for use in CircleCI continuous integration environment

var browserName = ['chrome', 'firefox', 'internet explorer', 'android'][process.env.CIRCLE_NODE_INDEX];

module.exports = {
  seleniumServerURL: {
    hostname: 'ondemand.saucelabs.com',
    port: 80
  },
  driverCapabilities: {
    'tunnel-identifier': 'circle-' + process.env.CIRCLE_BUILD_NUM + '-' + process.env.CIRCLE_NODE_INDEX,
    browserName: browserName
  },
  tags: [ 'circle-ci', '#' + process.env.CIRCLE_BUILD_NUM ],
  views: [ 'Verbose', 'SauceLabs' ],
  quit: 'always', // avoid wasting 90 seconds on SauceLabs
  bail: true,
  build: 'CircleCI#' + process.env.CIRCLE_BUILD_NUM
}
