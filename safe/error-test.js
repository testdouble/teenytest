var helper = require('./support/helper')
var assert = require('core-assert')

module.exports = function (cb) {
  helper.run('safe/fixtures/fail-function.js', function (er, result, log) {
    assert.equal(result, false)
    log.assert(
      'TAP version 13',
      '1..2',
      'not ok 1 - "raw error" - test #1 in `safe/fixtures/fail-function.js`',
      '  ---',
      '  message: undefined',
      '  stacktrace: ',
      '  ...',
      'not ok 2 - "error object" - test #2 in `safe/fixtures/fail-function.js`',
      '  ---',
      '  message: wrapped',
      /stacktrace: Error: wrapped/,
      '  ...',
      '# Test run failed!',
      '#   Passed: 0',
      '#   Failed: 2',
      '#   Total:  2',
      '#',
      '# Failures:',
      '#',
      '#   1 - "raw error" - test #1 in `safe/fixtures/fail-function.js`',
      '#',
      '#    Error: raw',
      '#',
      '#   2 - "error object" - test #2 in `safe/fixtures/fail-function.js`',
      '#',
      /# {5}Error: wrapped/
    )
    cb(er)
  })
}
