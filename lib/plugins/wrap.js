var _ = require('lodash')
var pluginsStore = require('./store')
var resultsStore = require('../report/results-store')
var userFunctionStore = require('./user-function-store')
var callbackify = require('./callbackify')

module.exports = function wrap (action) {
  var metadata = _.omit(action, 'callable')
  if (metadata.type === 'userFunction') {
    action.callable = callbackify(metadata, action.callable)
  }

  return _.reduce(pluginsStore.wrappers(action.type), function (memo, wrapper) {
    var runX = injectResultsIntoUserCallbacks(memo.callable, metadata)
    return _.assign(memo, {
      callable: function (cb) {
        return wrapper.wrap(runX, metadata, function (er, value) {
          if (metadata.type === 'userFunction') {
            userFunctionStore.setPlugin(metadata, value, er, wrapper.name)
          }
          cb(er, value)
        })
      }
    })
  }, action)
}

function injectResultsIntoUserCallbacks (callable, metadata) {
  if (metadata.type === 'userFunction') {
    return function (cb) {
      callable(function (er, value) {
        cb(er, userFunctionStore.get(metadata))
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
