/**
 * This plugin should be passed the teenytest logger and loaded
 *   absolutely last after all other plugins, because it'll intentionally
 *   swallow the errors of all teenytest user actions in order to properly
 *   log the test success, failure & error output
 */
module.exports = function (log) {
  var results = {
    overallPassing: true,
    nestedPassing: [true]
  }

  return {
    plugin: {
      name: 'teenytest-results',
      sticky: false,
      wrappers: {
        userFunction: function (runUserFunction, metadata, cb) {
          runUserFunction(function (er) {
            if (er) {
              markFailure(results)
            }

            logResults(metadata, results, log, er)
            cb(null)
          })
        },
        suite: function (runSuite, metadata, cb) {
          results.nestedPassing.push(true)
          runSuite(function (er) {
            results.nestedPassing.pop()
            cb(er)
          })
        }
      }
    },
    isPassing: function () {
      return results.overallPassing === true
    }
  }
}

function markFailure (results) {
  results.overallPassing = false
  results.nestedPassing[results.nestedPassing.length - 1] = false
}

function logResults (metadata, results, log, er) {
  if (nestedFailureIn(results)) {
    metadata.failureHandler(log)
  } else {
    metadata.successHandler(log)
  }

  if (er) {
    metadata.errorHandler(log, er)
  }
}

function nestedFailureIn (results) {
  return _.some(results.nestedPassing, function (result) { return result === false })
}

