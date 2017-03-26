var helper = require('./support/helper')
var assert = require('core-assert')

module.exports = function (cb) {
  helper.run('safe/fixtures/nested-sparse-test.js#woot', function (er, result, log) {
    assert.equal(result, true)
    log.assert(
      'TAP version 13',
      '1..1',
      'ok 1 - "a b c d e woot" - test #1 in `safe/fixtures/nested-sparse-test.js`'
    )
    cb(er)
  })
}

