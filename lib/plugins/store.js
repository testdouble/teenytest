var _ = require('lodash')

var registeredPlugins = []

module.exports = {
  wrappers: function (type) {
    return _([].concat(_.map(registeredPlugins, 'translators'))
             .concat(_.map(registeredPlugins, 'supervisors'))
             .concat(_.map(registeredPlugins, 'analyzers'))
             .concat(_.map(registeredPlugins, 'interceptors'))
             .concat(_.map(registeredPlugins, 'reporters')))
           .map(type).compact().value()
  },
  register: function (definition) {
    registeredPlugins.push(definition)
  },
  unregister: function (name) {
    registeredPlugins = _.reject(registeredPlugins, function (plugin) {
      return plugin.name === name
    })
  },
  unregisterAll: function () {
    registeredPlugins = []
  }
}

