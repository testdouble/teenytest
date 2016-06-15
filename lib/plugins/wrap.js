var _ = require('lodash')
var pluginsStore = require('./store')

module.exports = function wrap (action) {
  var wrappers = _.compact(_.map(pluginsStore.all(), 'wrappers.' + action.type))

  return _.reduce(wrappers, function (memo, wrapper) {
    var runX = memo.callable
    var metadata = _.omit(memo, 'callable')
    return _.assign({}, memo, {
      callable: function (cb) {
        return wrapper(runX, metadata, cb)
      }
    })
  }, action)
}

