var glob = require('glob')
var _ = require('lodash')
var path = require('path')

module.exports = function(testGlob, options) {
  var log = options.output || console.log,
    cwd = options.cwd || process.cwd(),
    helper = _.extend({}, {
      beforeAll: function(){},
      afterAll: function(){},
      beforeEach: function(){},
      afterEach: function(){}
    }, options.helperPath ? require(path.resolve(cwd, options.helperPath)) : {}),
    files = glob.sync(testGlob),
    testModules = _.map(files, function(file) {
      var testModule = require(path.resolve(cwd, file)),
          tests = _.isFunction(testModule) ? [_.assign(testModule,{testName: testModule.name})] : _(testModule).
            functions().without('beforeEach','beforeAll','afterEach','afterAll').
            map(function(funcName) {
              return _.extend(testModule[funcName], {
                testName: funcName || testModule[funcName.name]
              })
            }).value()

      return {
        tests: tests,
        file: file,
        beforeAll: testModule.beforeAll || function(){},
        afterAll: testModule.afterAll || function(){},
        beforeEach: testModule.beforeEach || function(){},
        afterEach: testModule.afterEach || function(){}
      }
    }),
    currentTestOrdinal = 1,
    passed = true

  log('TAP version 13')
  log('1..'+_(testModules).map('tests.length').sum())

  helper.beforeAll()
  _.each(testModules, function(testModule) {
    testModule.beforeAll()
    _.each(testModule.tests, function(test, i) {
      var context = {}
      helper.beforeEach.call(context)
      testModule.beforeEach.call(context)
      try {
        test.call(context)

        log('ok '+currentTestOrdinal+' - '+(test.testName ? '"'+test.testName+'" - ' : '')+'test #'+(i+1)+' in `'+testModule.file+'`')
      } catch(e) {
        passed = false
        log('not ok '+currentTestOrdinal+' - '+(test.testName ? '"'+test.testName+'" - ' : '')+'test #'+(i+1)+' in `'+testModule.file+'`')
        log('  ---')
        log('  message: '+e.message)
        log('  stacktrace:',e.stack)
        log('  ...')
      }
      helper.afterEach.call(context)
      testModule.afterEach.call(context)
      currentTestOrdinal++
    })
    testModule.afterAll()
  })
  helper.afterAll()

  return passed
}
