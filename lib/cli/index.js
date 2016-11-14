var _defaults = require('lodash/defaults')

var teenytest = require('../../index')
var argvOptions = require('./argv-options')
var parsePackageOptions = require('./parse-package-options')

module.exports = function () {
  parsePackageOptions(function (er, packageOpts) {
    var options = _defaults(argvOptions(), packageOpts)
    teenytest(options.testLocator, options, function (er, passing) {
      process.exit(!er && passing ? 0 : 1)
    })
  })
}
