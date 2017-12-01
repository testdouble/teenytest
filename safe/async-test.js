var helper = require('./support/helper')
var assert = require('core-assert')

module.exports = function (cb) {
  helper.run('safe/fixtures/async-*.js', function (er, result, log) {
    assert.equal(result, false)
    log.assert(
      'TAP version 13',
      '1..6',
      ' An error occurred in test hook: "module beforeAll" defined in `safe/fixtures/async-beforeAll-fails-all.js`',
      '  ---',
      '  message: nope',
      /stacktrace: Error: nope/,
      '  ...',
      'not ok 1 - "test1" - test #1 in `safe/fixtures/async-beforeAll-fails-all.js` [SKIPPED]',
      'not ok 2 - "test2" - test #2 in `safe/fixtures/async-beforeAll-fails-all.js` [SKIPPED]',
      'not ok 3 - test #1 in `safe/fixtures/async-error-test.js`',
      '  ---',
      '  message: Something bad',
      /stacktrace: Error: Something bad/,
      '  ...',
      'not ok 4 - test #1 in `safe/fixtures/async-fail-test.js`',
      '  ---',
      '  message: 98 == 42',
      /stacktrace: AssertionError: 98 == 42/,
      '  ...',
      'ok 5 - "firstTest" - test #1 in `safe/fixtures/async-good-test.js`',
      'ok 6 - "secondTest" - test #2 in `safe/fixtures/async-good-test.js`',
      '# Test run failed!',
      '#   Passed: 2',
      '#   Failed: 4',
      '#   Total:  6',
      '#',
      '# Failures:',
      '#',
      '#   1 - "test1" - test #1 in `safe/fixtures/async-beforeAll-fails-all.js`',
      '#',
      '#     A setup hook (beforeEach or beforeAll) failed so the test never ran',
      '#',
      '#   2 - "test2" - test #2 in `safe/fixtures/async-beforeAll-fails-all.js`',
      '#',
      '#     A setup hook (beforeEach or beforeAll) failed so the test never ran',
      '#',
      '#   3 - test #1 in `safe/fixtures/async-error-test.js`',
      '#',
      /# {5}Error: Something bad/,
      '#',
      '#   4 - test #1 in `safe/fixtures/async-fail-test.js`',
      '#',
      /# {5}AssertionError: 98 == 42/
    )
    cb(er)
  })
}
