var _ = require('lodash')
var assert = require('assert')

module.exports = {
  beforeAll: function (done) {
    _.defer(function () { this.hooks = ['A']; done() })
  },
  beforeEach: function (done) {
    _.defer(function () { this.hooks.push('B'); done() })
  },
  firstTest: function (done) {
    _.defer(function () {
      assert.deepStrictEqual(this.hooks, ['A', 'B'])
      done()
    })
  },
  secondTest: function (done) {
    _.defer(function () {
      assert.deepStrictEqual(this.hooks, ['A', 'B', 'C', 'B'])
      done()
    })
  },
  afterEach: function (done) {
    _.defer(function () { this.hooks.push('C'); done() })
  },
  afterAll: function (done) {
    _.defer(function () {
      assert.deepStrictEqual(this.hooks, ['A', 'B', 'C', 'B', 'C'])
      done()
    })
  }
}
