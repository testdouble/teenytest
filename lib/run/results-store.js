var _ = require('lodash')

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
    return !_.some(store.all('results'), ['passing', false])
  },
  currentTestHasFailed: function () {
    return _.get(current(), 'passing') === false
  },
  // Return true if a beforeAll failed and the suite should not be run
  currentTestSetUpFailed: function () {
    return _.some(currentNesting, 'setUpFailed')
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

    _.each(currentNesting, function (nestedResult) {
      _.set(nestedResult, 'passing', false)
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
    return _(current().errors).map('metadata').some(function (errorMetadata) {
      return errorMetadata.isAssociatedWithATest &&
             errorMetadata.distanceFromTest <= afterEachDistanceFromTest
    })
  }
}

function get (metadata) {
  return store.read('results', metadata.id)
}

function createResult (metadata) {
  var result = set(metadata, _.assign(_.omit(metadata, 'callable'), {
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
  return _.last(currentNesting)
}

function clearNestedFailures (result) {
  result.passing = true
  result.setUpFailed = false
  result.errors = []

  _.each(result.children, function (child) {
    clearNestedFailures(child)
  })
}
