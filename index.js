var _ = require('lodash')
var buildTestModules = require('./lib/build-test-modules')
var buildTestActions = require('./lib/build-test-actions')
var buildTestHelper = require('./lib/build-test-helper')
var countTests = require('./lib/count-tests')
var runner = require('./lib/runner')
var userFunctionAsyncWrapperFactory = require('./lib/user-function-async-wrapper-factory.js')

module.exports = function (testGlob, userOptions, cb) {
  if (arguments.length < 3) { cb = userOptions; userOptions = {} }
  var cwd = userOptions.cwd || process.cwd()
  var helper = buildTestHelper(userOptions.helperPath, cwd)
  var options = _.assign({}, {
    output: console.log,
    asyncTimeout: 5000,
    asyncInterval: 10
  }, userOptions, helper.options)
  var log = options.output
  var testModules = buildTestModules(testGlob, cwd)

  log('TAP version 13')
  log('1..' + countTests(testModules))

  runner(buildTestActions(testModules, helper), userFunctionAsyncWrapperFactory(options, log), function (e, result) {
    if (e) {
      log('A fatal error occurred!')
      log('  ---')
      log('  message: ' + e.message || e.toString())
      log('  stacktrace:', e.stack)
      log('  ...')
    }

    cb(e, result)
  })
}

