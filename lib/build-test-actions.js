var _ = require('lodash')
var async = require('async')

module.exports = function (testModules, helper) {
  var stats = {suiteCount: 0, fileCounts: {}}
  var suite = {
    name: 'global',
    type: 'suite',
    children: _.flatten([
      actionForHook(helper.beforeAll, 'global beforeAll', null, helper.file),
      _.map(testModules, function (exampleGroup) {
        return actionsForExampleGroup(exampleGroup, [], helper, stats)
      }),
      actionForHook(helper.afterAll, 'global afterAll', null, helper.file)
    ]),
    callable: function (cb) {
      async.series(_.map(suite.children, 'callable'), cb)
    }
  }

  return suite
}

var actionsForExampleGroup = function (exampleGroup, ancestors, helper, stats) {
  var name = exampleGroup.name || 'module'
  var suite = {
    name: name,
    type: 'suite',
    children: _.flatten([
      actionForHook(exampleGroup.beforeAll, name + ' beforeAll', null, exampleGroup.file),
      _.map(exampleGroup.items, function (item) {
        if (item.__teenytest__type === 'group') {
          return actionsForExampleGroup(item, ancestors.concat(exampleGroup), helper, stats)
        } else {
          return actionsForTestFunctions(item, ancestors.concat(exampleGroup), helper, stats)
        }
      }),
      actionForHook(exampleGroup.afterAll, name + ' afterAll', null, exampleGroup.file)
    ]),
    callable: function (cb) {
      async.series(_.map(suite.children, 'callable'), cb)
    }
  }

  return suite
}

var actionsForTestFunctions = function (test, ancestors, helper, stats) {
  incrementCounts(stats, test)
  var testActions = {
    name: test.name,
    type: 'test',
    description: test.description(stats.suiteCount, stats.fileCounts[test.file]),
    suiteNames: test.ancestorNames,
    children: _.flatten([
      actionForHook(helper.beforeEach, 'global beforeEach', test.context, helper.file),
      _.map(ancestors, function (ancestor) {
        return actionForHook(ancestor.beforeEach, (ancestor.name || 'module') +
                             ' beforeEach', test.context, ancestor.file)
      }),
      actionForTest(test, stats),
      actionForHook(helper.afterEach, 'global afterEach', test.context, helper.file),
      _(ancestors).reverse().map(function (ancestor) {
        return actionForHook(ancestor.afterEach, (ancestor.name || 'module') +
                             ' afterEach', test.context, ancestor.file)
      }).value()
    ]),
    callable: function (cb) {
      async.series(_.map(testActions.children, 'callable'), cb)
    }
  }

  return testActions
}

var actionForHook = function (helperFunc, name, context, file) {
  var action = {
    name: name,
    type: 'userFunction',
    subType: 'hook',
    description: 'test hook: ' + name + (file ? ' defined in `' + file + '`' : ''),
    callable: helperFunc.bind(context || {}),
    isAssociatedWithATest: !_.isNil(context)
  }

  return action
}

var actionForTest = function (test, stats) {
  var action = {
    name: test.name,
    type: 'userFunction',
    subType: 'test',
    description: test.description(stats.suiteCount, stats.fileCounts[test.file]),
    callable: test.testFunction.bind(test.context),
    isAssociatedWithATest: true
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
