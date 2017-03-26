var helper = require('./support/helper')
var assert = require('core-assert')

module.exports = function (cb) {
  helper.run('safe/fixtures/basic-*.js', function (er, result, log) {
    assert.equal(result, true)
    log.assert(
      'TAP version 13',
      '1..3',
      'ok 1 - test #1 in `safe/fixtures/basic-test-passing-function.js`',
      'ok 2 - "bar" - test #1 in `safe/fixtures/basic-test-passing-object.js`',
      'ok 3 - "baz" - test #2 in `safe/fixtures/basic-test-passing-object.js`'
    )
    cb(er)
  })
}
