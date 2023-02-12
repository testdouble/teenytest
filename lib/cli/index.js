const _ = require('lodash')

const teenytest = require('../../index')
const argvOptions = require('./argv-options')
const parsePackageOptions = require('./parse-package-options')

module.exports = function () {
  parsePackageOptions(function (er, packageOpts) {
    const options = _.defaults(argvOptions(), packageOpts)
    teenytest(options.testLocator, options, function (er, passing) {
      process.exit(!er && passing ? 0 : 1)
    })
  })
}
