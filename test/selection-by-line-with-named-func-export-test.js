var helper = require('./support/helper')
var assert = require('core-assert')

module.exports = function (cb) {
  helper.run('test/fixtures/single-named-func.js:2', function (er, result, log) {
    assert.equal(result, true)
    log.assert(
      'TAP version 13',
      '1..1',
      'ok 1 - "pop" - test #1 in `test/fixtures/single-named-func.js`'
    )
    cb(er)
  })
}
