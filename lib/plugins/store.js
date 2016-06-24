var _ = require('lodash')

var registeredPlugins = []
var pluginsStore

module.exports = pluginsStore = {
  list: function () {
    return _.map(registeredPlugins, 'name')
  },
  wrappers: function (scope) {
    return _.compact([].concat(wrappersFor('translators', scope))
                       .concat(wrappersFor('supervisors', scope))
                       .concat(wrappersFor('analyzers', scope))
                       .concat(wrappersFor('interceptors', scope))
                       .concat(wrappersFor('reporters', scope)))
  },
  register: function (definition) {
    if (!definition.name) {
      throw new Error('Plugins are required to have a "name" attribute.')
    } else if (_.some(registeredPlugins, ['name', definition.name])) {
      var existing = _.find(registeredPlugins, ['name', definition.name])
      if (existing === definition) {
        pluginsStore.unregister(existing.name)
      } else {
        throw new Error(
          'A different plugin named "' + existing.name + '" is already ' +
          'registered. First unregister it with ' +
          '`teenytest.plugins.unregister("' + existing.name + '"))`.')
      }
    }

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

function wrappersFor (lifecycleEvent, scope) {
  return _(registeredPlugins).filter(lifecycleEvent + '.' + scope)
    .map(function (plugin) {
      return {
        name: plugin.name,
        scope: scope,
        lifecycleEvent: lifecycleEvent,
        wrap: plugin[lifecycleEvent][scope]
      }
    }).value()
}

