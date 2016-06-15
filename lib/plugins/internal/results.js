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
          runUserFunction(function (er) {
            if (er) {
              markFailure(results, er)
              if (!metadata.isAssociatedWithATest) {
                logError(log, metadata, _.last(results.nestedResults).errors.pop())
              }
            }
            cb(null)
          })
        },
        test: function (runTest, metadata, cb) {
          runTest(function (er) {
            if (er) {
              markFailure(results, er)
            }

            log((anyFailureIn(results) ? 'not ' : '') + 'ok ' + metadata.description)

            _.each(_.last(results.nestedResults).errors, function (er, i) {
              logError(log, metadata, er)
            })

            cb(null)
          })
        },
        suite: function (runSuite, metadata, cb) {
          results.nestedResults.push({passing: true, errors: []})
          runSuite(function (er) {
            if (er) {
              markFailure(results, er)
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

function markFailure (results, er) {
  results.overallPassing = false
  var currentNesting = _.last(results.nestedResults)
  currentNesting.passing = false
  currentNesting.errors.push(er)
}

function anyFailureIn (results) {
  return _.some(results.nestedResults, function (result) {
    return result.passing === false
  })
}

function logError (log, metadata, e) {
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
