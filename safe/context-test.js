const helper = require('./support/helper')
const assert = require('core-assert')

module.exports = function (cb) {
  helper.run('safe/fixtures/context-*.js', function (er, result, log) {
    assert.equal(result, true)
    log.assert(
      'TAP version 13',
      '1..2',
      'ok 1 - "test1" - test #1 in `safe/fixtures/context-test.js`',
      'ok 2 - "test2" - test #2 in `safe/fixtures/context-test.js`'
    )
    cb(er)
  })
}
