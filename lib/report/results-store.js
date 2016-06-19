var _ = require('lodash')

var errorStore = require('./error-store')

var results

module.exports = resultsStore = {
  // Setup
  initialize: function () {
    results = {
      overallPassing: true,
      all: {},
      currentNesting: []
    }
  },

  // Queries
  getResultFor: function (metadata) {
    return results.all[metadata.id]
  },
  getErrorsFor: function (metadata) {
    // TODO: replaces a query that filtered down to isAssociatedWithATest but seems unnecessary since when called on a test this will always be false, right?
    return _.map(resultsStore.getResultFor(metadata).errors, 'error')
  },
  isPassing: function () {
    return results.overallPassing === true
  },
  currentTestHasFailed: function () {
    var deepest = _.last(results.currentNesting)
    if (deepest) {
      return !deepest.passing
    }
  },
  // Return true if a beforeAll failed and the suite should not be run
  currentTestSetUpFailed: function () {
    return _.some(results.currentNesting, 'setUpFailed')
  },

  // Mutate current context
  nest: function (metadata) {
    var newlyNestedResult = results.all[metadata.id] = _.assign({},
      _.omit(metadata, 'callable'), {
      passing: true,
      setUpFailed: false,
      errors: [],
      children: [],
      triggerFailure: function (er) {
        resultsStore.markFailure(metadata, er)
      }
    })

    if (results.currentNesting.length > 0) {
      _.last(results.currentNesting).children.push(newlyNestedResult)
    }

    results.currentNesting.push(newlyNestedResult)
  },
  unNest: function () {
    results.currentNesting.pop()
  },
  markFailure: function (metadata, er) {
    results.overallPassing = false
    errorStore.add(metadata, er)

    if (metadata.hookType === 'beforeAll') {
      _.last(results.currentNesting).setUpFailed = true
    }

    _.each(results.currentNesting, function (nestedResult) {
      _.set(nestedResult, 'passing', false)
    })

    _.last(results.currentNesting).errors.push({
      metadata: metadata,
      error: er
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
