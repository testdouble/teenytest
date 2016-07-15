var _ = require('lodash/core')
var minimist = require('minimist')

module.exports = function () {
  var argv = minimist(process.argv.slice(2))

  return {
    testLocator: _.last(argv['_']),
    helperPath: argv['helper'],
    asyncTimeout: argv['timeout'],
    configurator: argv['configurator'],
    plugins: argv['plugin'] ? [].concat(argv['plugin']) : undefined
  }
}
