var helper = require('./support/helper')
var assert = require('assert')

module.exports = function (cb) {
  helper.run('safe/fixtures/syntax-error-test.js', function (er, result, log) {
    assert.strictEqual(result, undefined)
    assert.match(log.read()[0], /Error: this is a loading error/)
    assert.match(log.read()[0], /syntax-error-test\.js/)
    cb()
  })
}
