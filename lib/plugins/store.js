var _ = require('lodash')

var registeredPlugins = []

module.exports = {
  all: function () {
    return [].concat(_.map(registeredPlugins, 'translators'))
             .concat(_.map(registeredPlugins, 'supervisors'))
             .concat(_.map(registeredPlugins, 'analyzers'))
             .concat(_.map(registeredPlugins, 'interceptors'))
             .concat(_.map(registeredPlugins, 'reporters'))
  },
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

