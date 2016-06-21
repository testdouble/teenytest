var errors

module.exports = {
  initialize: function () {
    errors = {}
  },
  add: function (metadata, er) {
    // TODO: delete this branch if it's unreachable
    if (errors[metadata.id]) {
      console.warning('Warning: Uh oh, an errror was already added for object ' +
                       metadata.id + '! Metadata:', metadata, 'Existing error:',
                       errors[metadata.id], 'New error:', er)
    }
    errors[metadata.id] = er
  },
  get: function (metadata) {
    return errors[metadata.id]
  },
  clear: function (metadata) {
    delete errors[metadata.id]
  }
}
