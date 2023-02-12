const _ = require('lodash')
const pluginsStore = require('./store')
const resultsStore = require('../run/results-store')
const userFunctionStore = require('./user-function-store')
const callbackify = require('./callbackify')

module.exports = function wrap (action) {
  if (action.type === 'userFunction') {
    return wrapUserFunction(action)
  } else {
    return wrapTestOrSuite(action)
  }
}

function wrapUserFunction (action) {
  const metadata = _.omit(action, 'callable')
  action.callable = callbackify(metadata, action.callable)

  return _.reduce(pluginsStore.wrappers(action.type), function (memo, wrapper) {
    const callable = memo.callable
    const runX = function (cb) {
      callable(function (er, value) {
        cb(er, userFunctionStore.get(metadata))
      })
    }

    return _.assign(memo, {
      callable: function (cb) {
        return wrapper.wrap(runX, metadata, function (er, value) {
          userFunctionStore.setPlugin(metadata, value, er, wrapper.name)
          cb(er, value)
        })
      }
    })
  }, action)
}

function wrapTestOrSuite (action) {
  const metadata = _.omit(action, 'callable')

  return _.reduce(pluginsStore.wrappers(action.type), function (memo, wrapper) {
    const callable = memo.callable
    const runX = function (cb) {
      callable(function (er) {
        cb(er, resultsStore.getResultFor(metadata))
      })
    }

    return _.assign(memo, {
      callable: function (cb) {
        return wrapper.wrap(runX, metadata, cb)
      }
    })
  }, action)
}
