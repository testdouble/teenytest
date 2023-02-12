const _ = require('lodash')

const store = require('../store')

store.onInitialize(function () {
  store.initializeStore('plugins')
})

module.exports = {
  list: function () {
    return _.map(store.all('plugins'), 'name')
  },
  wrappers: function (scope) {
    return _.compact([].concat(wrappersFor('translators', scope))
      .concat(wrappersFor('supervisors', scope))
      .concat(wrappersFor('analyzers', scope))
      .concat(wrappersFor('interceptors', scope))
      .concat(wrappersFor('reporters', scope)))
  },
  register: function (definition) {
    ensureStoreIsInitialized()
    if (!definition.name) {
      throw new Error('Plugins are required to have a "name" attribute.')
    }

    const existing = _.find(store.all('plugins'), ['name', definition.name])
    if (existing) {
      if (existing === definition) {
        store.destroy('plugins', existing.name)
      } else {
        throw new Error(
          'A different plugin named "' + existing.name + '" is already ' +
          'registered. First unregister it with ' +
          '`teenytest.plugins.unregister("' + existing.name + '"))`.')
      }
    }

    store.create('plugins', definition.name, definition)
  },
  unregister: function (name) {
    store.destroy('plugins', name)
  },
  unregisterAll: function () {
    store.initializeStore('plugins')
  }
}

function wrappersFor (lifecycleEvent, scope) {
  return _(store.all('plugins')).filter(lifecycleEvent + '.' + scope)
    .map(function (plugin) {
      return {
        name: plugin.name,
        scope,
        lifecycleEvent,
        wrap: plugin[lifecycleEvent][scope]
      }
    }).value()
}

function ensureStoreIsInitialized () {
  if (!store.isInitialized()) {
    throw new Error(
      'A teenytest run has not been properly kicked off yet, so plugins cannot ' +
      'be registered. Consider registering the plugin via the `--plugin` CLI, a ' +
      '`teenytest.plugins` property in your package.json, or via a `configurator` ' +
      'function. See the teenytest README.md for more information on registering ' +
      'plugins.'
    )
  }
}
