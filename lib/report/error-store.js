var errors

module.exports = {
  initialize: function () {
    errors = {}
  },
  add: function (metadata, er) {
    errors[metadata.id] = er
  },
  get: function (metadata) {
    return errors[metadata.id]
  },
  clear: function (metadata) {
    delete errors[metadata.id]
  }
}
