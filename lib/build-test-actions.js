var _drop = require('lodash/drop')
var _flatten = require('lodash/flatten')
var _hasIn = require('lodash/hasIn')
var _isNil = require('lodash/isNil')
var _map = require('lodash/map')
var async = require('async')

var id
module.exports = function (glob, testModules, helper) {
  id = 0
  var stats = {suiteCount: 0, fileCounts: {}}
  var suite = {
    id: ++id,
    name: 'global',
    type: 'suite',
    file: glob,
    ancestorNames: [],
    children: _flatten([
      actionForHook(helper.beforeAll, 'global', 'beforeAll', null, helper.file),
      _map(testModules, function (exampleGroup) {
        return actionsForExampleGroup(exampleGroup, [], helper, stats)
      }),
      actionForHook(helper.afterAll, 'global', 'afterAll', null, helper.file)
    ]),
    callable: function (cb) {
      async.series(_map(suite.children, 'callable'), cb)
    }
  }

  return suite
}

var actionsForExampleGroup = function (exampleGroup, ancestors, helper, stats) {
  var name = exampleGroup.name
  var hookName = _drop(exampleGroup.ancestorNames, 2).join(' ') || 'module'
  var suite = {
    id: ++id,
    name: name,
    type: 'suite',
    file: exampleGroup.file,
    ancestorNames: exampleGroup.ancestorNames,
    children: _flatten([
      actionForHook(exampleGroup.beforeAll, hookName, 'beforeAll', null, exampleGroup.file),
      _map(exampleGroup.items, function (item) {
        if (item.type === 'suite') {
          return actionsForExampleGroup(item, ancestors.concat(exampleGroup), helper, stats)
        } else {
          return actionsForTestFunctions(item, ancestors.concat(exampleGroup), helper, stats)
        }
      }),
      actionForHook(exampleGroup.afterAll, hookName, 'afterAll', null, exampleGroup.file)
    ]),
    callable: function (cb) {
      async.series(_map(suite.children, 'callable'), cb)
    }
  }

  return suite
}

var actionsForTestFunctions = function (test, ancestors, helper, stats) {
  incrementCounts(stats, test)
  var testActions = {
    id: ++id,
    name: test.name,
    type: 'test',
    description: test.description(stats.suiteCount, stats.fileCounts[test.file]),
    ancestorNames: test.ancestorNames,
    isAssociatedWithATest: true,
    children: _flatten([
      beforeEachActions(helper, test, ancestors),
      actionForTest(test, stats),
      afterEachActions(helper, test, ancestors)
    ]),
    callable: function (cb) {
      async.series(_map(testActions.children, 'callable'), cb)
    }
  }

  return testActions
}

function beforeEachActions (helper, test, ancestors) {
  var maxDistance = ancestors.length
  var globalBeforeEach = actionForHook(helper.beforeEach, 'global', 'beforeEach',
                                       test.context, helper.file, maxDistance)
  return [globalBeforeEach].concat(_map(ancestors, function (ancestor, i) {
    return actionForAncestorHook('beforeEach', ancestor, maxDistance - 1 - i, test)
  }))
}

function afterEachActions (helper, test, ancestors) {
  var maxDistance = ancestors.length
  var globalAfterEach = actionForHook(helper.afterEach, 'global', 'afterEach',
                                      test.context, helper.file, maxDistance)
  return ancestors.reverse().map(function (ancestor, i) {
    return actionForAncestorHook('afterEach', ancestor, i, test)
  }).concat(globalAfterEach)
}

function actionForAncestorHook (type, ancestor, distanceFromTest, test) {
  var name = _drop(test.ancestorNames, 2).join(' ') || 'module'
  return actionForHook(ancestor[type], name,
                       type, test.context, ancestor.file, distanceFromTest)
}

var actionForHook = function (helperFunc, name, hookType, context, file, distance) {
  var action = {
    id: ++id,
    name: name,
    type: 'userFunction',
    subType: 'hook',
    hookType: hookType,
    description: 'test hook: "' + name + ' ' + hookType + '"' +
                 (file ? ' defined in `' + file + '`' : ''),
    callable: helperFunc.bind(context || {}),
    isAssociatedWithATest: !_isNil(context),
    distanceFromTest: distance || 0
  }

  return action
}

var actionForTest = function (test, stats) {
  var action = {
    id: ++id,
    name: test.name,
    type: 'userFunction',
    subType: 'test',
    description: test.description(stats.suiteCount, stats.fileCounts[test.file]),
    callable: test.testFunction.bind(test.context),
    isAssociatedWithATest: true,
    distanceFromTest: 0
  }

  return action
}

function incrementCounts (stats, test) {
  stats.suiteCount++
  if (_hasIn(stats.fileCounts, test.file)) {
    stats.fileCounts[test.file]++
  } else {
    stats.fileCounts[test.file] = 1
  }
}
