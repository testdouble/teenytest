var waitForCallback = require('./wait-for-callback')
var _ = require('lodash')

module.exports = function (options, log) {
  return function (userAction, results) {
    return function (cb) {
      if (userAction.callable.length === 0) {
        var error
        try {
          userAction.callable()
        } catch (e) {
          error = e
          markFailure(results)
        }
        triggerActionHandlers(userAction, results, log, error)
        cb(null)
      } else {
        waitForCallback(userAction.callable, options.asyncInterval, options.asyncTimeout, function (e) {
          if (e) {
            markFailure(results)
          }
          triggerActionHandlers(userAction, results, log, e)
          cb(null)
        })
      }
    }
  }
}

var markFailure = function (results) {
  results.overallPassing = false
  results.nestedPassing[results.nestedPassing.length - 1] = false
  return results
}

var triggerActionHandlers = function (userAction, results, log, error) {
  if (nestedFailureIn(results)) {
    userAction.failureHandler(log)
  } else {
    userAction.successHandler(log)
  }
  if (error) {
    userAction.errorHandler(log, error)
  }
}

var nestedFailureIn = function (results) {
  return _.some(results.nestedPassing, function (result) { return result === false })
}

