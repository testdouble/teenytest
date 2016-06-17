var _ = require('lodash')
var Tap13 = require('../../report/tap13')

/**
 * This plugin should be passed the teenytest logger and loaded
 *   absolutely last after all other plugins, because it'll intentionally
 *   swallow the errors of all teenytest user actions in order to properly
 *   log the test success, failure & error output
 */
module.exports = function (log) {
  var tap13 = new Tap13(log)
  var results = {
    overallPassing: true,
    nestedResults: [{passing: true, errors: []}]
  }

  return {
    plugin: {
      name: 'teenytest-results',
      sticky: false,
      wrappers: {
        userFunction: function (runUserFunction, metadata, cb) {
          if (!shouldBeRun(results, metadata)) return cb(null)

          runUserFunction(function (er) {
            if (er) {
              markFailure(results, metadata, er)
              if (!metadata.isAssociatedWithATest) {
                tap13.error(er, metadata.description)
              }
            }
            cb(null)
          })
        },
        test: function (runTest, metadata, cb) {
          if (testFailed(results)) {
            tap13.test(metadata.description, {pass: false, skip: true})
            return cb(null)
          }
          // resultsStore.nest()
          results.nestedResults.push({passing: true, errors: []})
          runTest(function (er) {
            if (er) {
              markFailure(results, metadata, er)
            }

            tap13.test(metadata.description, {pass: !testFailed(results)})

            var errors = _(results.nestedResults).map('errors').last()
            _.each(errors, function (er, i) {
              if (er.metadata.isAssociatedWithATest) {
                tap13.error(er.error)
              }
            })

            // resultsStore.unNest()
            results.nestedResults.pop()
            cb(null)
          })
        },
        suite: function (runSuite, metadata, cb) {
          if (testFailed(results)) return cb(null)
          // resultsStore.nest()
          results.nestedResults.push({passing: true, errors: []})
          runSuite(function (er) {
            if (er) {
              markFailure(results, metadata, er)
              tap13.error(er, 'suite: "' + metadata.name + '" in ' +
                              '`' + metadata.file + '`')
            }
            // resultsStore.unNest()
            results.nestedResults.pop()
            cb(null)
          })
        }
      }
    },
    isPassing: function () {
      return results.overallPassing === true
    }
  }
}

function markFailure (results, metadata, er) {
  results.overallPassing = false
  var currentNesting = _.last(results.nestedResults)
  currentNesting.passing = false
  currentNesting.errors.push({
    metadata: metadata,
    error: er
  })
}

function testFailed (results) {
  return !_(results.nestedResults).map('passing').every()
}

function shouldBeRun (results, metadata) {
  if (!testFailed(results) ||
      shouldRunAfterEach(results, metadata) ||
      metadata.hookType === 'afterAll') {
    return true
  } else {
    return false
  }
}

function shouldRunAfterEach (results, metadata) {
  if (metadata.hookType !== 'afterEach') return false
//  return resultsStore.afterEachCleanupNecessary(metadata.distanceFromTest)
  var errors = _.last(results.nestedResults).errors
  return _(errors).map('metadata').some(function (errorMetadata) {
    return errorMetadata.isAssociatedWithATest &&
           errorMetadata.distanceFromTest <= metadata.distanceFromTest
  })
}

