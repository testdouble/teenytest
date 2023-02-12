const assert = require('core-assert')

module.exports = {
  'a long passing test name': function () {
    const a = 1
    const b = 2

    const result = a + b

    assert.equal(result, 3)
  },
  'a long failing test name': function () {
    throw new Error('I fail')
  }
}
