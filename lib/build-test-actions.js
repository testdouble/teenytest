var _ = require('lodash')

module.exports = function (testModules, helper) {
  return [
    actionForHook(helper.beforeAll, 'global beforeAll', null, helper.file),
    actionsForExampleGroups(testModules, helper),
    actionForHook(helper.afterAll, 'global afterAll', null, helper.file)
  ]
}

var actionsForExampleGroups = function (exampleGroups, helper) {
  return _.map(exampleGroups, function (exampleGroup) {
    return [
      actionForHook(exampleGroup.beforeAll, exampleGroup.name + ' beforeAll', null, exampleGroup.file),
      actionsForTestFunctions(exampleGroup, helper),
      actionForHook(exampleGroup.afterAll, exampleGroup.name + ' afterAll', null, exampleGroup.file)
    ]
  })
}

var actionsForTestFunctions = function (testModule, helper) {
  return _.map(testModule.tests, function (test) {
    return [
      actionForHook(helper.beforeEach, 'global beforeEach', test.context, helper.file),
      actionForHook(testModule.beforeEach, 'module beforeEach', test.context, testModule.file),
      actionForTest(test),
      actionForHook(helper.afterEach, 'global afterEach', test.context, helper.file),
      actionForHook(testModule.afterEach, 'module afterEach', test.context, testModule.file)
    ]
  })
}

var actionForHook = function (helperFunc, desc, context, file) {
  var action = {
    description: 'test hook: ' + desc + (file ? ' defined in `' + file + '`' : ''),
    callable: helperFunc.bind(context || {}),
    successHandler: function (log) {},
    failureHandler: function (log) {},
    errorHandler: function (log, e) {
      if (e) {
        log(' An error occurred in ' + action.description)
        log('  ---')
        log('  message: ' + e.message || e.toString())
        log('  stacktrace:', e.stack)
        log('  ...')
      }
    }
  }

  return action
}

var actionForTest = function (test) {
  var action = {
    description: test.description,
    callable: test.testFunction.bind(test.context),
    successHandler: function (log) {
      log('ok ' + action.description)
    },
    failureHandler: function (log) {
      log('not ok ' + action.description)
    },
    errorHandler: function (log, e) {
      if (e) {
        log('  ---')
        log('  message: ' + e.message || e.toString())
        log('  stacktrace:', e.stack)
        log('  ...')
      }
    }
  }

  return action
}
