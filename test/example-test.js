var helper = require('./support/helper')
var assert = require('assert')

module.exports = function (cb) {
  helper.run('example/test/lib/**/*.js', function (er, result, log) {
    assert.equal(result, false)
    log.assert(
      'TAP version 13',
      '1..5',
      'ok 1 - "adds" - test #1 in `example/test/lib/exporting-an-object.js`',
      'ok 2 - "subtracts" - test #2 in `example/test/lib/exporting-an-object.js`',
      'ok 3 - "a long passing test name" - test #1 in `example/test/lib/multi-word-names.js`',
      'not ok 4 - "a long failing test name" - test #2 in `example/test/lib/multi-word-names.js`',
      '  ---',
      '  message: I fail',
      /stacktrace: Error: I fail/,
      '  ...',
      'not ok 5 - "blueIsRed" - test #1 in `example/test/lib/single-function.js`',
      '  ---',
      '  message: \'blue\' == \'red\'',
      /stacktrace: AssertionError: 'blue' == 'red'/,
      '  ...'
    )
    cb(er)
  })
}
