var _ = require('lodash')

var registeredPlugins = []

module.exports = {
  all: function () {
    return _.clone(registeredPlugins)
  }
  register: function (definition) {
    registeredPlugins.push(definition)
  },
  unregister: function (name) {
    registeredPlugins = _.reject(registeredPlugins, function (plugin) {
      return plugin.name === name && plugin.sticky !== true
    })
  },
  unregisterAll: function () {
    registeredPlugins = _.filter(registeredPlugins, ['sticky', true])
  }
}


