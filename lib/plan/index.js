var _ = require('lodash')
var async = require('async')

var id
module.exports = function (preparation) {
  id = 0
  var stats = {suiteCount: 0, fileCounts: {}}
  var suite = {
    id: ++id,
    name: 'global',
    type: 'suite',
    file: '(top-level)',
    ancestorNames: [],
    children: _.flatten([
      actionForHook(preparation.helper.beforeAll, 'global', 'beforeAll', null, preparation.helper.file),
      _.map(preparation.modules, function (exampleGroup) {
        return actionsForExampleGroup(exampleGroup, [], preparation.helper, stats)
      }),
      actionForHook(preparation.helper.afterAll, 'global', 'afterAll', null, preparation.helper.file)
    ]),
    callable: function (cb) {
      async.series(_.map(suite.children, 'callable'), cb)
    }
  }

  return suite
}

var actionsForExampleGroup = function (exampleGroup, ancestors, helper, stats) {
  var name = exampleGroup.name
  var hookName = _.drop(exampleGroup.ancestorNames, 2).join(' ') || 'module'
  var suite = {
    id: ++id,
    name: name,
    type: 'suite',
    file: exampleGroup.file,
    ancestorNames: exampleGroup.ancestorNames,
    children: _.flatten([
      actionForHook(exampleGroup.beforeAll, hookName, 'beforeAll', null, exampleGroup.file),
      _.map(exampleGroup.items, function (item) {
        if (item.type === 'suite') {
          return actionsForExampleGroup(item, ancestors.concat(exampleGroup), helper, stats)
        } else {
          return actionsForTestFunctions(item, ancestors.concat(exampleGroup), helper, stats)
        }
      }),
      actionForHook(exampleGroup.afterAll, hookName, 'afterAll', null, exampleGroup.file)
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
    id: ++id,
    name: test.name,
    type: 'test',
    description: test.description(stats.suiteCount, stats.fileCounts[test.file]),
    ancestorNames: test.ancestorNames,
    isAssociatedWithATest: true,
    children: _.flatten([
      beforeEachActions(helper, test, ancestors),
      actionForTest(test, stats),
      afterEachActions(helper, test, ancestors)
    ]),
    callable: function (cb) {
      async.series(_.map(testActions.children, 'callable'), cb)
    }
  }

  return testActions
}

function beforeEachActions (helper, test, ancestors) {
  var maxDistance = ancestors.length
  var globalBeforeEach = actionForHook(helper.beforeEach, 'global', 'beforeEach',
                                       test.context, helper.file, maxDistance)
  return [globalBeforeEach].concat(_.map(ancestors, function (ancestor, i) {
    return actionForAncestorHook('beforeEach', ancestor, maxDistance - 1 - i, test)
  }))
}

function afterEachActions (helper, test, ancestors) {
  var maxDistance = ancestors.length
  var globalAfterEach = actionForHook(helper.afterEach, 'global', 'afterEach',
                                      test.context, helper.file, maxDistance)
  return _(ancestors).reverse().map(function (ancestor, i) {
    return actionForAncestorHook('afterEach', ancestor, i, test)
  }).value().concat(globalAfterEach)
}

function actionForAncestorHook (type, ancestor, distanceFromTest, test) {
  var name = _.drop(test.ancestorNames, 2).join(' ') || 'module'
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
    isAssociatedWithATest: !_.isNil(context),
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
  if (_.hasIn(stats.fileCounts, test.file)) {
    stats.fileCounts[test.file]++
  } else {
    stats.fileCounts[test.file] = 1
  }
}
