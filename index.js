var _ = require('lodash')
var path = require('path')
var async = require('async')
var userActionsFactory = require('./lib/user-actions-factory')
var buildTestModules = require('./lib/build-test-modules')

module.exports = function(testGlob, userOptions, cb) {
  if(arguments.length < 3) { cb = userOptions; userOptions = {} }
  var cwd = userOptions.cwd || process.cwd(),
    helper = buildTestHelper(userOptions.helperPath, cwd),
    options = _.assign({}, {
      output: console.log,
      asyncTimeout: 5000,
      asyncInterval: 10
    }, userOptions, helper.options),
    log = options.output,
    testModules = buildTestModules(testGlob, cwd),
    userActions = userActionsFactory(options),
    passed = true

  log('TAP version 13')
  log('1..'+_(testModules).map('tests.length').sum())

  var thisTestSuitePassed = true
  var testSuiteErrorLogger = function(e, action){
    if(e) {
      thisTestSuitePassed = passed = false
      log(' An error occurred in '+action.description)
      log('  ---')
      log('  message: '+e.message)
      log('  stacktrace:',e.stack)
      log('  ...')
    }
  }
  testSuiteActions = [
    userActions.wrap(helper.beforeAll, {description: 'global test helper beforeAll hook'}, testSuiteErrorLogger),
    function(cb) {
      var testModuleActions = _(testModules).map(function(testModule, testModuleIndex){
        var thisTestModulePassed = true,
            testModuleErrorLogger = function(e, action){
              if(e) {
                thisTestModulePassed = passed = false
                log(' An error occurred in '+action.description)
                log('  ---')
                log('  message: '+e.message)
                log('  stacktrace:',e.stack)
                log('  ...')
              }
            }
        return [
          userActions.wrap(testModule.beforeAll, addHookDescription('beforeAll', testModule), testModuleErrorLogger),
          function(cb) {
            var testFunctionActions = _(testModule.tests).map(function(test, i){
              var thisTestPassed = true,
                  testFunctionErrorLogger = function(e, action) {
                    if(e) {
                      thisTestPassed = passed = false
                      log(' An error occurred in '+action.description)
                      log('  ---')
                      log('  message: '+e.message)
                      log('  stacktrace:',e.stack)
                      log('  ...')
                    }
                  }

              return [
                userActions.wrap(helper.beforeEach, addHookDescription('global beforeEach', test, i), testFunctionErrorLogger),
                userActions.wrap(testModule.beforeEach, addHookDescription('beforeEach', test, i), testFunctionErrorLogger),
                function(cb) {
                  userActions.invoke(test.testFunction, test, function(e){
                    if(!e && thisTestPassed && thisTestModulePassed && thisTestSuitePassed) {
                      log('ok '+test.description)
                    } else {
                      passed = false
                      log('not ok '+test.description)
                      if(e) {
                        log('  ---')
                        log('  message: '+e.message)
                        log('  stacktrace:',e.stack)
                        log('  ...')
                      }
                    }
                    cb(null)
                  })
                },
                userActions.wrap(helper.afterEach, addHookDescription('global afterEach', test, i), testFunctionErrorLogger),
                userActions.wrap(testModule.afterEach, addHookDescription('afterEach', test, i), testFunctionErrorLogger)
              ]
            }).flatten().value()

            async.series(testFunctionActions, cb)
          },
          userActions.wrap(testModule.afterAll, addHookDescription('afterAll', testModule), testModuleErrorLogger)
        ]
      }).flatten().value()

      async.series(testModuleActions, cb)
    },
    userActions.wrap(helper.afterAll, {description: 'global test helper afterAll hook'}, testSuiteErrorLogger)
  ]

  async.series(testSuiteActions, function(e) {
    if(e) {
      passed = false
      log('A fatal error occurred!')
      log('  ---')
      log('  message: '+e.message)
      log('  stacktrace:',e.stack)
      log('  ...')
    }

    cb(e, passed)
  })
}

var buildTestHelper = function(helperPath, cwd) {
  return _.assign({}, {
      beforeAll: function(){},
      afterAll: function(){},
      beforeEach: function(){},
      afterEach: function(){},
      options: {}
    }, helperPath ? require(path.resolve(cwd, helperPath)) : {})
}



addHookDescription = function(hookType, testOrModule, index) {
  return addDescription(testOrModule, hookDescription(hookType, testOrModule, index))
}
var addDescription = function(obj, description){
  return _.assign({}, obj, {description: description})
}
var hookDescription = function(hookType, testOrModule, index) {
  return hookType+' hook'+(_.isNumber(index) ? ' in test #'+(index+1) : '')+' in `'+testOrModule.file+'`'
}

