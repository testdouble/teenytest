var _ = require('lodash')
var minimist = require('minimist')

module.exports = function () {
  var argv = minimist(process.argv.slice(2))
  return {
    testLocator: _.isEmpty(argv['_']) ? undefined : _.castArray(argv['_']),
    name: argv['name'],
    helperPath: argv['helper'],
    asyncTimeout: argv['timeout'],
    configurator: argv['configurator'],
    plugins: argv['plugin'] ? _.castArray(argv['plugin']) : undefined
  }
}
