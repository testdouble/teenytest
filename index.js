var _ = require('lodash')

var buildTestHelper = require('./lib/build-test-helper')
var criteriaFor = require('./lib/criteria-for')
var buildTestModules = require('./lib/build-test-modules')
var buildTestActions = require('./lib/build-test-actions')
var filterSelectedTests = require('./lib/filter-selected-tests')
var cullTestlessGroups = require('./lib/cull-testless-groups')
var countTests = require('./lib/count-tests')
var runner = require('./lib/runner')

var pluginsStore = require('./lib/plugins/store')

module.exports = function (testLocator, userOptions, cb) {
  // 1. options setup
  if (arguments.length < 3) { cb = userOptions; userOptions = {} }
  var cwd = userOptions.cwd || process.cwd()
  var helper = buildTestHelper(userOptions.helperPath, cwd)
  var options = _.assign({}, {
    output: console.log,
    asyncTimeout: 5000
  }, userOptions, helper.options)
  var log = options.output
  var criteria = criteriaFor(testLocator)

  // 2. Build test module structure
  var testModules = cullTestlessGroups(
    filterSelectedTests(
      buildTestModules(criteria.glob, cwd),
      criteria,
      cwd
    )
  )

  // 3. run the tests

  // TODO - stick this into a TAP plugin as a preulde and fatal as a suite-wrap?
  log('TAP version 13')
  log('1..' + countTests(testModules))

  runner(
    buildTestActions(criteria.glob, testModules, helper),
    log,
    options.asyncTimeout,
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
