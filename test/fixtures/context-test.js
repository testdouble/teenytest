var assert = require('assert')

var contextyThings = []
module.exports = {
  beforeEach: function () {
    this.thing = {}
    contextyThings.push(this.thing)
  },
  test1: function () {
    assert.deepStrictEqual(this.thing, {})
    assert.deepStrictEqual(contextyThings, [{}])
  },
  test2: function () {
    assert.deepStrictEqual(this.thing, {})
    assert.deepStrictEqual(contextyThings, [{}, {}])
    assert.notEqual(contextyThings[0], contextyThings[1])
  },
  afterEach: function () {
    assert.deepStrictEqual(this.thing, {})
  }
}
