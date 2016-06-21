var _ = require('lodash')
var minimist = require('minimist')

module.exports = function () {
  var argv = minimist(process.argv.slice(2))

  return {
    testLocator: _.last(argv['_']),
    helperPath: argv['helper'],
    asyncTimeout: argv['timeout'],
    configurator: argv['configurator'],
    plugins: argv['plugin'] ? _.castArray(argv['plugin']) : undefined
  }
}
