var helper = require('./support/helper')
var assert = require('assert')

module.exports = function canSelectTestByName (cb) {
  helper.run('example/test/lib/single-function.js:493', function (er, result, log) {
    assert.equal(result, false)
    log.assert(
      'TAP version 13',
      '1..1',
      'not ok 1 - "blueIsRed" - test #1 in `example/test/lib/single-function.js`',
      '  ---',
      '  message: \'blue\' == \'red\'',
      /stacktrace: AssertionError: 'blue' == 'red'/
    )
    cb(er)
  })
}
