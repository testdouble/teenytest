var store = require('./store')

module.exports = {
  register: function (definition) {
    store.add(definition)
  },
}
