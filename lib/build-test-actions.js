var _ = require('lodash')

module.exports = function (testModules, helper) {
  var stats = {suiteCount: 0, fileCounts: {}}
  return [
    actionForHook(helper.beforeAll, 'global beforeAll', null, helper.file),
    _.map(testModules, function (exampleGroup) {
      return actionsForExampleGroup(exampleGroup, [], helper, stats)
    }),
    actionForHook(helper.afterAll, 'global afterAll', null, helper.file)
  ]
}

var actionsForExampleGroup = function (exampleGroup, ancestors, helper, stats) {
  return [
    actionForHook(exampleGroup.beforeAll, exampleGroup.name + ' beforeAll', null, exampleGroup.file),
    actionsForExampleGroupItems(exampleGroup, ancestors, helper, stats),
    actionForHook(exampleGroup.afterAll, exampleGroup.name + ' afterAll', null, exampleGroup.file)
  ]
}

var actionsForExampleGroupItems = function (exampleGroup, ancestors, helper, stats) {
  return _.map(exampleGroup.tests, function (item) {
    if (item.type === 'group') {
      return actionsForExampleGroup(item, ancestors.concat(exampleGroup), helper)
    } else {
      return actionsForTestFunctions(item, ancestors.concat(exampleGroup), helper, stats)
    }
  })
}

var actionsForTestFunctions = function (test, ancestors, helper, stats) {
  return [
    actionForHook(helper.beforeEach, 'global beforeEach', test.context, helper.file),
    _.map(ancestors, function (ancestor) {
      return actionForHook(ancestor.beforeEach, ancestor.name + ' beforeEach', test.context, ancestor.file)
    }),
    actionForTest(test, stats),
    actionForHook(helper.afterEach, 'global afterEach', test.context, helper.file),
    _.map(ancestors, function (ancestor) {
      return actionForHook(ancestor.afterEach, ancestor.name + ' afterEach', test.context, ancestor.file)
    })
  ]
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

var actionForTest = function (test, stats) {
  incrementCounts(stats, test)

  var action = {
    description: test.description(stats.suiteCount, stats.fileCounts[test.file]),
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

function incrementCounts (stats, test) {
  stats.suiteCount++
  if (_.hasIn(stats.fileCounts, test.file)) {
    stats.fileCounts[test.file]++
  } else {
    stats.fileCounts[test.file] = 1
  }
}
