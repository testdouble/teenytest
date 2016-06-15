var _ = require('lodash')

/**
 * This plugin should be passed the teenytest logger and loaded
 *   absolutely last after all other plugins, because it'll intentionally
 *   swallow the errors of all teenytest user actions in order to properly
 *   log the test success, failure & error output
 */
module.exports = function (log) {
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
                logError(log, metadata, _.last(results.nestedResults).errors.pop())
              }
            }
            cb(null)
          })
        },
        test: function (runTest, metadata, cb) {
          if (failedYet(results)) {
            log('not ok ' + metadata.description + ' [SKIPPED]')
            return cb(null)
          }
          results.nestedResults.push({passing: true, errors: []})
          runTest(function (er) {
            if (er) {
              markFailure(results, metadata, er)
            }

            var failed = failedYet(results)
            log((failed ? 'not ' : '') + 'ok ' + metadata.description)

            _.each(_.last(results.nestedResults).errors, function (er, i) {
              logError(log, metadata, er)
            })

            results.nestedResults.pop()
            cb(null)
          })
        },
        suite: function (runSuite, metadata, cb) {
          if (failedYet(results)) return cb(null)
          results.nestedResults.push({passing: true, errors: []})
          runSuite(function (er) {
            if (er) {
              markFailure(results, metadata, er)
              logError(log, metadata, er)
            }
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

function failedYet (results) {
  return !_(results.nestedResults).map('passing').every()
}

function logError (log, metadata, errorSummary) {
  var e = errorSummary.error
  if (e) {
    if (metadata.type === 'userFunction' && metadata.subType === 'hook') {
      log(' An error occurred in ' + metadata.description)
    }
    log('  ---')
    log('  message: ' + e.message || e.toString())
    log('  stacktrace:', e.stack)
    log('  ...')
  }
}

function shouldBeRun (results, metadata) {
  if (!failedYet(results) ||
      (testFuncErrored(results) && metadata.hookType === 'afterEach') ||
      metadata.hookType === 'afterAll') {
    return true
  } else {
    return false
  }
}

function testFuncErrored (results) {
  var errors = _.last(results.nestedResults).errors
  return _.some(errors, 'metadata.isAssociatedWithATest')
}

