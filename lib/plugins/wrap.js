var _ = require('lodash')
var pluginsStore = require('./store')
var resultsStore = require('../report/results-store')
var errorStore = require('../report/error-store')
var callbackify = require('./callbackify')

module.exports = function wrap (action) {
  var metadata = _.omit(action, 'callable')
  action.callable = callbackify(action.callable)

  return _.reduce(pluginsStore.wrappers(action.type), function (memo, wrapper) {
    var runX = injectResultsIntoUserCallbacks(memo.callable, metadata, wrapper)
    return _.assign(memo, {
      callable: function (cb) {
        return wrapper.wrap(runX, metadata, cb)
      }
    })
  }, action)
}

function injectResultsIntoUserCallbacks (callable, metadata) {
  if (metadata.type === 'userFunction') {
    return function (cb) {
      callable(function (er, value) {
        // store the error & result for the given plugin
        cb(er, {
          error: errorStore.get(metadata)
        })
      })
    }
  } else {
    return function (cb) {
      callable(function (er) {
        cb(er, resultsStore.getResultFor(metadata))
      })
    }
  }
}
