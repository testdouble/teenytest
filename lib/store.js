var _assign = require('lodash/assign')
var _each = require('lodash/each')
var _has = require('lodash/has')
var _isNil = require('lodash/isNil')

var store
var subscribers = []

module.exports = {
  initialize: function () {
    store = {}
    _each(subscribers, function (subscriber) {
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
    _assign(store[storeName][id], attrs)
  },
  destroy: function (storeName, id) {
    delete store[storeName][id]
  },

  // Other queries
  isInitialized: function () {
    return !_isNil(store)
  },
  ensure: function (storeName, id) {
    if (!_has(store, storeName + '.' + id)) {
      store[storeName][id] = {}
    }
    return store[storeName][id]
  },
  all: function (storeName) {
    return store[storeName]
  }
}
