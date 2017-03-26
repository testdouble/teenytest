var _ = require('lodash')

var defaultOptions = require('./lib/cli/default-options')
var buildTestHelper = require('./lib/build-test-helper')
var criteriaFor = require('./lib/criteria-for')
var plan = require('./lib/plan')
var buildTestActions = require('./lib/build-test-actions')
var runner = require('./lib/runner')

var pluginsStore = require('./lib/plugins/store')

module.exports = function (testLocator, userOptions, cb) {
  if (arguments.length < 3) { cb = userOptions; userOptions = {} }
  var cwd = userOptions.cwd || process.cwd()
  var options = _.defaults({}, userOptions, defaultOptions())
  var helper = buildTestHelper(options.helperPath, cwd)
  var log = options.output
  var criteria = criteriaFor(testLocator || options.testLocator)

  runner(
    buildTestActions(criteria.glob, plan(criteria, cwd), helper),
    options,
    function (e, result) {
      if (e) {
        log('A fatal error occurred!')
        log('  ---')
        log('  message: ' + e.message || e.toString())
        log('  stacktrace:', e.stack)
        log('  ...')
      }

      cb(e, result)
    }
  )
}

module.exports.plugins = pluginsStore
