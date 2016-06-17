var _ = require('lodash')

var results

module.exports = {
  // Setup
  initialize: function () {
    results = {
      overallPassing: true,
      nestedResults: [{passing: true, errors: []}]
    }
  },

  // Queries
  isPassing: function () {
    return results.overallPassing === true
  },
  currentTestHasFailed: function () {
    return !_(results.nestedResults).map('passing').every()
  },
  // This query makes no sense. Why wouldn't we want all errors regardless depth?
  deepestErrorsAssociatedWithATest: function () {
    return _(_(results.nestedResults).map('errors').last())
      .filter('metadata.isAssociatedWithATest')
      .map('error')
      .value()
  },

  // Mutate current context
  nest: function () {
    results.nestedResults.push({passing: true, errors: []})
  },
  unNest: function () {
    results.nestedResults.pop()
  },
  markFailure: function (metadata, er) {
    results.overallPassing = false
    var currentNesting = _.last(results.nestedResults)
    currentNesting.passing = false
    currentNesting.errors.push({
      metadata: metadata,
      error: er
    })
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
    var errors = _.last(results.nestedResults).errors
    return _(errors).map('metadata').some(function (errorMetadata) {
      return errorMetadata.isAssociatedWithATest &&
             errorMetadata.distanceFromTest <= afterEachDistanceFromTest
    })
  }

}
