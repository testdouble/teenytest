var store = require('../store')

store.onInitialize(function () {
  store.initializeStore('errors')
})

module.exports = {
  add: function (metadata, er) {
    store.create('errors', metadata.id, er)
  },
  get: function (metadata) {
    return store.read('errors', metadata.id)
  },
  clear: function (metadata) {
    store.destroy('errors', metadata.id)
  }
}
