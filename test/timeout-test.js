var helper = require('./support/helper')
var assert = require('core-assert')

module.exports = function (cb) {
  helper.run('test/fixtures/timeout-test.js', {
    asyncTimeout: 100
  }, function (er, result, log) {
    assert.equal(result, false)
    log.assert(
      'TAP version 13',
      '1..4',
      'not ok 1 - "tooSlow test1" - test #1 in `test/fixtures/timeout-test.js`',
      '  ---',
      '  message: Test timed out! (timeout: 100ms)',
      /stacktrace: Error: Test timed out/,
      '  ...',
      'ok 2 - "fastEnough test2" - test #2 in `test/fixtures/timeout-test.js`',
      'ok 3 - "fastEnough test3" - test #3 in `test/fixtures/timeout-test.js`',
      'ok 4 - "fastEnough test4" - test #4 in `test/fixtures/timeout-test.js`'
    )
    cb(er)
  })
}

