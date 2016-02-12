var glob = require('glob')
var _ = require('lodash')
var path = require('path')
var async = require('async')

var anyAsyncInTestRun
module.exports = function(testGlob, options, cb) {
  if(arguments.length < 3) { cb = options; options = {} }
  var log = options.output || console.log,
    cwd = options.cwd || process.cwd(),
    helper = buildTestHelper(options.helperPath, cwd),
    testModules = buildTestModules(testGlob, cwd),
    anyAsyncInTestRun = false
    passed = true

  log('TAP version 13')
  log('1..'+_(testModules).map('tests.length').sum())

  var thisTestSuitePassed = true
  var testSuiteErrorLogger = function(e, action){
    if(e) {
      thisTestSuitePassed = passed = false
      log('# An error occurred in '+action.description)
      log('#  ---')
      log('#  message: '+e.message)
      log('#  stacktrace:',e.stack)
      log('#  ...')
    }
  }
  testSuiteActions = [
    wrap(helper.beforeAll, {description: 'global test helper beforeAll hook'}, testSuiteErrorLogger),
    function(cb) {
      var testModuleActions = _(testModules).map(function(testModule, testModuleIndex){
        var thisTestModulePassed = true,
            testModuleErrorLogger = function(e, action){
              if(e) {
                thisTestModulePassed = passed = false
                log('# An error occurred in '+action.description)
                log('#  ---')
                log('#  message: '+e.message)
                log('#  stacktrace:',e.stack)
                log('#  ...')
              }
            }
        return [
          wrap(testModule.beforeAll, addHookDescription('beforeAll', testModule), testModuleErrorLogger),
          function(cb) {
            var testFunctionActions = _(testModule.tests).map(function(test, i){
              var thisTestPassed = true,
                  testFunctionErrorLogger = function(e, action) {
                    if(e) {
                      thisTestPassed = passed = false
                      log('# An error occurred in '+action.description)
                      log('#  ---')
                      log('#  message: '+e.message)
                      log('#  stacktrace:',e.stack)
                      log('#  ...')
                    }
                  }

              return [
                wrap(helper.beforeEach, addHookDescription('global beforeEach', test, i), testFunctionErrorLogger),
                wrap(testModule.beforeEach, addHookDescription('beforeEach', test, i), testFunctionErrorLogger),
                function(cb) {
                  callUserFunction(test.testFunction, test.context, function(e){
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
                wrap(helper.afterEach, addHookDescription('global afterEach', test, i), testFunctionErrorLogger),
                wrap(testModule.afterEach, addHookDescription('afterEach', test, i), testFunctionErrorLogger)
              ]
            }).flatten().value()

            async.series(testFunctionActions, cb)
          },
          wrap(testModule.afterAll, addHookDescription('afterAll', testModule), testModuleErrorLogger)
        ]
      }).flatten().value()

      async.series(testModuleActions, cb)
    },
    wrap(helper.afterAll, {description: 'global test helper afterAll hook'}, testSuiteErrorLogger),
  ]

  async.series(testSuiteActions, function(e) {
    if(e) {
      log('A fatal error occurred!')
      log('  ---')
      log('  message: '+e.message)
      log('  stacktrace:',e.stack)
      log('  ...')
    }
    cb(e)
  })
}

var buildTestHelper = function(helperPath, cwd) {
  return _.extend({}, {
      beforeAll: function(){},
      afterAll: function(){},
      beforeEach: function(){},
      afterEach: function(){}
    }, helperPath ? require(path.resolve(cwd, helperPath)) : {})
}

var buildTestModules = function(testGlob, cwd) {
  var currentTestOrdinal = 0
  return _.map(glob.sync(testGlob), function(file) {
    var testModule = require(path.resolve(cwd, file)),
        tests = _.map(testFunctionsIn(testModule), function(testEntry, i) {
          currentTestOrdinal++

          return {
            testFunction: testEntry.testFunction,
            testName: testEntry.testName,
            context: Object.create(null),
            description: currentTestOrdinal+' - '+testSummaryDescription(file, testEntry.testName, i),
            file: file
          }
        })

    return {
      tests: tests,
      file: file,
      beforeAll: testModule.beforeAll || function(){},
      afterAll: testModule.afterAll || function(){},
      beforeEach: testModule.beforeEach || function(){},
      afterEach: testModule.afterEach || function(){}
    }
  })
}

var testFunctionsIn = function(testModule) {
  if(_.isFunction(testModule)) {
    return [{
      testFunction: testModule,
      testName: testModule.name
    }]
  } else {
    return _(testModule).functions().
      without('beforeEach','beforeAll','afterEach','afterAll').
      map(function(testName){
        return {
          testFunction: testModule[testName],
          testName: testName
        }
      }).
      value()
  }
}

var waitForCallback = require('./lib/wait-for-callback')
var wrap = function(userFunction, testOrModule, errorLogger) {
  return _.assign(function(cb) {
      callUserFunction(userFunction, testOrModule, cb, errorLogger)
    },
    { object: testOrModule}
  )
}
var callUserFunction = function(userFunction, testOrModule, cb, errorHandler) {
  var context = testOrModule ? testOrModule.context : this
  if(userFunction.length == 0) {
    try {
      userFunction.call(context)
      cb(null)
    } catch(e) {
      if(errorHandler) {
        errorHandler(e, testOrModule)
        cb(null)
      } else {
        cb(e)
      }
    }
  } else {
    anyAsyncInTestRun = true
    waitForCallback(userFunction, context , 10, 5000, function(e){
      if(e) {
        if(errorHandler) {
          errorHandler(e, testOrModule)
          cb(null)
        } else {
          cb(e)
        }
      } else {
        cb(null)
      }
    })
  }
}

var testSummaryDescription = function(file, testName, index) {
  return (testName ? '"'+testName+'" - ' : '')+'test #'+(index+1)+' in `'+file+'`'
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

