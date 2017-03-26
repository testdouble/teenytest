var helper = require('./support/helper')
var assert = require('core-assert')

module.exports = function (cb) {
  helper.run('safe/fixtures/hook-fail.js', function (er, result, log) {
    assert.equal(result, false)
    log.assert(
      'TAP version 13',
      '1..1',
      'not ok 1 - "thisIsNotOk" - test #1 in `safe/fixtures/hook-fail.js`',
      '  ---',
      '  message: Bad hook do not run!',
      /stacktrace: Error: Bad hook do not run/,
      '  ...'
    )
    cb(er)
  })
}
