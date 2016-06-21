var _ = require('lodash')

var errorStore = require('./error-store')

var results, resultsStore

module.exports = resultsStore = {
  // Setup
  initialize: function () {
    results = {
      all: {},
      currentNesting: []
    }
  },

  // Queries
  getResultFor: function (metadata) {
    return get(metadata)
  },
  isPassing: function () {
    return !_.some(results.all, ['passing', false])
  },
  currentTestHasFailed: function () {
    return _.get(current(), 'passing') === false
  },
  // Return true if a beforeAll failed and the suite should not be run
  currentTestSetUpFailed: function () {
    return _.some(results.currentNesting, 'setUpFailed')
  },

  // Mutate current context
  nest: function (metadata) {
    var result = createResult(metadata)
    var parentResult = current()
    if (parentResult) {
      parentResult.children.push(result)
    }
    results.currentNesting.push(result)
  },
  unNest: function () {
    results.currentNesting.pop()
  },
  markFailure: function (metadata, er) {
    var result = current()
    errorStore.add(metadata, er)
    result.errors.push({
      metadata: metadata,
      error: er
    })

    if (metadata.hookType === 'beforeAll') {
      result.setUpFailed = true
    }

    _.each(results.currentNesting, function (nestedResult) {
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
    var errors = _.last(results.currentNesting).errors
    return _(errors).map('metadata').some(function (errorMetadata) {
      return errorMetadata.isAssociatedWithATest &&
             errorMetadata.distanceFromTest <= afterEachDistanceFromTest
    })
  }
}

function get (metadata) {
  return results.all[metadata.id]
}

function createResult (metadata) {
  var result = set(metadata, _.assign(_.omit(metadata, 'callable'), {
    passing: true,
    setUpFailed: false,
    errors: [],
    children: [],
    triggerFailure: function (er) {
      errorStore.add(metadata, er)
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
  results.all[metadata.id] = result
  return result
}

function current () {
  return _.last(results.currentNesting)
}

function clearNestedFailures (result) {
  result.passing = true
  result.setUpFailed = false
  _.each(result.errors, function (errorObj) {
    errorStore.clear(errorObj.metadata)
  })
  result.errors = []

  _.each(result.children, function (child) {
    clearNestedFailures(child)
  })
}
