var assert = require('core-assert')

var teenytest = require('../index')

module.exports = function (cb) {
  var error
  try {
    teenytest.plugins.register({name: 'lol'})
  } catch (e) {
    error = e
  }

  assert.equal(error.message,
    'A teenytest run has not been properly kicked off yet, so plugins cannot ' +
    'be registered. Consider registering the plugin via the `--plugin` CLI, a ' +
    '`teenytest.plugins` property in your package.json, or via a `configurator` ' +
    'function. See the teenytest README.md for more information on registering ' +
    'plugins.')

  cb(null)
}
