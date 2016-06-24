var store = require('../store')

store.onInitialize(function () {
  store.initializeStore('userFunction')
})

module.exports = {
  get: function (metadata) {
    return store.read('userFunction', metadata.id)
  },
  set: function (metadata, value, error) {
    store.update('userFunction', metadata.id, { value: value, error: error })
  },
  setPlugin: function (metadata, value, error, pluginName) {
    var result = store.ensure('userFunction', metadata.id)
    result.plugins = result.plugins || {}
    result.plugins[pluginName] = {
      value: value,
      error: error
    }
  }
}
