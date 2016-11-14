var _defaults = require('lodash/defaults')

var defaultOptions = require('./lib/cli/default-options')
var buildTestHelper = require('./lib/build-test-helper')
var criteriaFor = require('./lib/criteria-for')
var buildTestModules = require('./lib/build-test-modules')
var buildTestActions = require('./lib/build-test-actions')
var filterSelectedTests = require('./lib/filter-selected-tests')
var cullTestlessGroups = require('./lib/cull-testless-groups')
var runner = require('./lib/runner')

var pluginsStore = require('./lib/plugins/store')

module.exports = function (testLocator, userOptions, cb) {
  // 1. options setup
  if (arguments.length < 3) { cb = userOptions; userOptions = {} }
  var cwd = userOptions.cwd || process.cwd()
  var options = _defaults({}, userOptions, defaultOptions())
  var helper = buildTestHelper(options.helperPath, cwd)

  var log = options.output
  var criteria = criteriaFor(testLocator || options.testLocator)

  // 2. Build test module structure
  var testModules = cullTestlessGroups(
    filterSelectedTests(
      buildTestModules(criteria.glob, cwd),
      criteria,
      cwd
    )
  )

  // 3. run the tests
  runner(
    buildTestActions(criteria.glob, testModules, helper),
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
