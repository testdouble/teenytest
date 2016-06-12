var _ = require('lodash')
var pluginsStore = require('./plugins/store')

module.exports = function wrapperify (userAction) {
  var wrappers = _.map(_.filter(registeredPlugins, function (plugin) {
    return plugin.type === 'wrapper' && _.isFunction(plugin[type])
  }), type)

  return _.reduce(wrappers, function (memo, wrapper) {
    return _.assign({}, memo, {
      callable: function (cb) {
        return wrapper.bind(memo.context)(memo.callable, _.omit(memo, 'callable'), cb)
      }
    })
  }, userAction)
}


