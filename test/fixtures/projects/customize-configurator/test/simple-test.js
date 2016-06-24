var assert = require('core-assert')

module.exports = {
  beforeAll: function () {
    // Just be here for a plugin's sake.
  },
  add: function () {
    assert.equal(5, 3 + 2)
  },
  subtract: function () {
    assert.equal(5, 11 - 6)
  }
}
