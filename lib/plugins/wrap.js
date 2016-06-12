var _ = require('lodash')
var pluginsStore = require('./store')

module.exports = function wrap (action) {
  var wrappers = _.map(_.filter(pluginsStore.all(), function (plugin) {
    return plugin.type === 'wrapper' && _.isFunction(plugin[type])
  }), action.type)

  return _.reduce(wrappers, function (memo, wrapper) {
    return _.assign({}, memo, {
      callable: function (cb) {
        return wrapper.bind(memo.context)(memo.callable, _.omit(memo, 'callable'), cb)
      }
    })
  }, action)
}


