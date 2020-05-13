var helper = require('./support/helper')
var assert = require('assert')

module.exports = function (cb) {
  helper.run('safe/fixtures/syntax-error-test.js', function (er, result, log) {
    assert.strictEqual(result, undefined)
    assert(log.read()[0].match(/Error: this is a loading error/))
    assert(log.read()[0].match(/syntax-error-test\.js/))
    cb()
  })
}
