var _castArray = require('lodash/castArray')
var _last = require('lodash/last')

var minimist = require('minimist')

module.exports = function () {
  var argv = minimist(process.argv.slice(2))

  return {
    testLocator: _last(argv['_']),
    helperPath: argv['helper'],
    asyncTimeout: argv['timeout'],
    configurator: argv['configurator'],
    plugins: argv['plugin'] ? _castArray(argv['plugin']) : undefined
  }
}
