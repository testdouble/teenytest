var _ = require('lodash')

var results

module.exports = {
  initialize: function () {
    results = {
      overallPassing: true,
      nestedResults: [{passing: true, errors: []}]
    }
  },
  nest: function () {
    results.nestedResults.push({passing: true, errors: []})
  },
  unNest: function () {
    results.nestedResults.pop()
  },
  testFailed: function () {
    return !_(results.nestedResults).map('passing').every()
  },

  // This is a confusing function:
  //
  // an afterEach should be run if a beforeEach or test function at the same or
  // deeper nesting level failed. "Distance" in this case is the number of layers
  // of nesting away from the test function itself. For instance:
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
