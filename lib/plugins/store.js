var _ = require('lodash')

var registeredPlugins = []

module.exports = {
  add: function (definition) {
    registeredPlugins.push(definition)
  },
  getWrappers: function () {
    return _.transform(registeredPlugins, function (result, plugin) {
      if (_.has(plugin, 'wrappers.test')) {
        result.test.push(pluggin.wrappers.test)
      }
    }, { test: [] })
  }
}


