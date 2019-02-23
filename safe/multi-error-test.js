var helper = require('./support/helper')
var assert = require('core-assert')

module.exports = function (cb) {
  helper.run('safe/fixtures/multi-error.js', function (er, result, log) {
    assert.equal(result, false)
    log.assert(
      'TAP version 13',
      '1..3',
      'not ok 1 - "beforePlusAfter test" - test #1 in `safe/fixtures/multi-error.js`',
      '  ---',
      /Error: A/,
      '  ...',
      '  ---',
      /Error: C/,
      '  ...',
      'not ok 2 - "afterRuinsIt foo test" - test #2 in `safe/fixtures/multi-error.js`',
      '  ---',
      /Error: D/,
      '  ...',
      'not ok 3 - "testPlusAfter test" - test #3 in `safe/fixtures/multi-error.js`',
      '  ---',
      /Error: E/,
      '  ...',
      '  ---',
      /Error: F/,
      '  ...'
    )
    cb(er)
  })
}
