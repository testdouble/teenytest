var _ = require('lodash')
var minimist = require('minimist')

var teenytest = require('../../index')
var parsePackageOptions = require('./parse-package-options')

module.exports = function () {
  parsePackageOptions(function (er, packageOpts) {
    var options = _.defaults(argv(), packageOpts)
    teenytest(options.testLocator, options, function (er, passing) {
      process.exit(!er && passing ? 0 : 1)
    })
  })
}

function argv () {
  var argv = minimist(process.argv.slice(2))

  return {
    testLocator: _.last(argv['_']),
    helperPath: argv['helper'],
    asyncTimeout: argv['timeout']
  }
}
