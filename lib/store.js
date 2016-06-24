var _ = require('lodash')

var store
var subscribers = []

module.exports = {
  initialize: function () {
    store = {}
    _.each(subscribers, function (subscriber) {
      subscriber()
    })
  },
  reset: function () {
    store = undefined
  },
  onInitialize: function (subscriber) {
    subscribers.push(subscriber)
  },
  initializeStore: function (storeName) {
    store[storeName] = {}
  },

  // CRUD
  create: function (storeName, id, value) {
    store[storeName][id] = value
  },
  read: function (storeName, id) {
    return store[storeName][id]
  },
  update: function (storeName, id, attrs) {
    store[storeName][id] = store[storeName][id] || {}
    _.assign(store[storeName][id], attrs)
  },
  destroy: function (storeName, id) {
    delete store[storeName][id]
  },

  // Other queries
  isInitialized: function () {
    return !_.isNil(store)
  },
  ensure: function (storeName, id) {
    if (!_.has(store, storeName + '.' + id)) {
      store[storeName][id] = {}
    }
    return store[storeName][id]
  },
  all: function (storeName) {
    return store[storeName]
  }
}
