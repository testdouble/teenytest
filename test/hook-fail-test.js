var helper = require('./support/helper')
var assert = require('assert')

module.exports = function (cb) {
  helper.run('test/fixtures/hook-fail.js', function (er, result, log) {
    assert.equal(result, false)
    log.assert(
      'TAP version 13',
      '1..1',
      'not ok 1 - "thisIsNotOk" - test #1 in `test/fixtures/hook-fail.js`',
      '  ---',
      '  message: Bad hook do not run!',
      /stacktrace: Error: Bad hook do not run/,
      '  ...'
    )
    cb(er)
  })
}

