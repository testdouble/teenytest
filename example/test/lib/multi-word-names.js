var assert = require('core-assert')

module.exports = {
  'a long passing test name': function () {
    var a = 1
    var b = 2

    var result = a + b

    assert.equal(result, 3)
  },
  'a long failing test name': function () {
    throw new Error('I fail')
  }
}
