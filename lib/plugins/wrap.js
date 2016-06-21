var _ = require('lodash')
var pluginsStore = require('./store')
var resultsStore = require('../report/results-store')
var errorStore = require('../report/error-store')

module.exports = function wrap (action) {
  var metadata = _.omit(action, 'callable')

  return _.reduce(pluginsStore.wrappers(action.type), function (memo, wrapper) {
    var runX = sprinkleResultsIntoCallbackRunnables(memo.callable, metadata)
    return _.assign(memo, {
      callable: function (cb) {
        return wrapper(runX, metadata, cb)
      }
    })
  }, action)
}

function sprinkleResultsIntoCallbackRunnables (callable, metadata) {
  if (metadata.type === 'userFunction') {
    if (callable.length === 0) {
      return function (cb) {
        try {
          var value = callable()
          return cb(null, {value: value, error: null})
        } catch (er) {
          return cb(er, {error: er, value: undefined})
        }
      }
    } else {
      return function (cb) {
        callable(function (er, value) {
          cb(er, {
            value: value,
            error: errorStore.get(metadata)
          })
        })
      }
    }
  } else {
    return _.wrap(callable, function (runX, cb) {
      runX(function (er) {
        cb(er, resultsStore.getResultFor(metadata))
      })
    })
  }
}
