var _ = require('lodash')
var pluginsStore = require('./store')
var resultsStore = require('../report/results-store')

module.exports = function wrap (action) {
  var wrappers = _.compact(_.map(pluginsStore.all(), 'wrappers.' + action.type))
  var metadata = _.omit(action, 'callable')

  return _.reduce(wrappers, function (memo, wrapper) {
    var runX = sprinkleResultsIntoCallbackRunnables(memo, action)
    return _.assign(memo, {
      callable: function (cb) {
        return wrapper(runX, metadata, cb)
      }
    })
  }, action)
}

function sprinkleResultsIntoCallbackRunnables (memo, action) {
  if (action.type === 'userFunction') return memo.callable

  return _.wrap(memo.callable, function (runX, cb) {
    runX(function (er) {
      cb(er, resultsStore.getResultFor(action))
    })
  })

}
