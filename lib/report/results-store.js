var _assign = require('lodash/assign')
var _each = require('lodash/each')
var _get = require('lodash/get')
var _last = require('lodash/last')
var _map = require('lodash/map')
var _omit = require('lodash/omit')
var _set = require('lodash/set')
var _some = require('lodash/some')

var store = require('../store')

var resultsStore, currentNesting

store.onInitialize(function () {
  currentNesting = []
  store.initializeStore('results')
})

module.exports = resultsStore = {
  // Queries
  getResultFor: function (metadata) {
    return get(metadata)
  },
  isPassing: function () {
    return !_some(store.all('results'), ['passing', false])
  },
  currentTestHasFailed: function () {
    return _get(current(), 'passing') === false
  },
  // Return true if a beforeAll failed and the suite should not be run
  currentTestSetUpFailed: function () {
    return _some(currentNesting, 'setUpFailed')
  },

  // Mutate current context
  nest: function (metadata) {
    var result = createResult(metadata)
    var parentResult = current()
    if (parentResult) {
      parentResult.children.push(result)
    }
    currentNesting.push(result)
  },
  unNest: function () {
    currentNesting.pop()
  },
  markFailure: function (metadata, er) {
    var result = current()
    result.errors.push({
      metadata: metadata,
      error: er
    })

    if (metadata.hookType === 'beforeAll') {
      result.setUpFailed = true
    }

    _each(currentNesting, function (nestedResult) {
      _set(nestedResult, 'passing', false)
    })
  },
  failTest: function (metadata) {
    resultsStore.getResultFor(metadata).passing = false
  },
  skipTest: function (metadata) {
    resultsStore.getResultFor(metadata).skipped = true
  },

  // This is a confusing function. The goal: we want to run an afterEach, only
  // when at least some other function at the same depth (a beforeEach or the
  // test function itself) also ran, to give the user a chance to clean up
  // resources (like a `finally` block)
  //
  // foo: {
  //   bar: {
  //     baz: function () {}, // test, distance 0
  //     afterEach: function () {} // distance 0
  //   },
  //   afterEach: function () {} // distance 1
  // }
  //
  // In the above example, if test 'foo bar baz' fails, it'll be at a distance
  // less than the final afterEach, so that afterEach ought to be run.
  afterEachCleanupNecessary: function (afterEachDistanceFromTest) {
    return _map(current().errors, 'metadata').some(function (errorMetadata) {
      return errorMetadata.isAssociatedWithATest &&
             errorMetadata.distanceFromTest <= afterEachDistanceFromTest
    })
  }
}

function get (metadata) {
  return store.read('results', metadata.id)
}

function createResult (metadata) {
  var result = set(metadata, _assign(_omit(metadata, 'callable'), {
    passing: true,
    setUpFailed: false,
    errors: [],
    children: [],
    triggerFailure: function (er) {
      result.passing = false
      result.errors.push({
        metadata: metadata,
        error: er
      })
    },
    clearFailures: function () {
      clearNestedFailures(result)
    }
  }))
  return result
}

function set (metadata, result) {
  store.create('results', metadata.id, result)
  return result
}

function current () {
  return _last(currentNesting)
}

function clearNestedFailures (result) {
  result.passing = true
  result.setUpFailed = false
  result.errors = []

  _each(result.children, function (child) {
    clearNestedFailures(child)
  })
}
