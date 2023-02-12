const assert = require('core-assert')

module.exports = {
  add: function () {
    assert.equal(5, 3 + 2)
  },
  subtract: function () {
    assert.equal(5, 11 - 6)
  }
}
