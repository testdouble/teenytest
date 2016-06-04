var helper = require('./support/helper')
var assert = require('assert')

module.exports = function (cb) {
  helper.run('test/fixtures/nested-test.js', function (er, result, log) {
    assert.deepEqual(global.__results,[
      'A',
      'B',
      'C',
      'J',
      'D',
      'B',
      'E',
      'F',
      'H',
      'J',
      'B',
      'E',
      'G',
      'H',
      'J',
      'I',
      'K'
    ])
    assert.equal(result, true)
    log.assert(
      'TAP version 13',
      '1..3',
      'ok 1 - "test1" - test #1 in `test/fixtures/nested-test.js`',
      'ok 2 - "sub test2" - test #2 in `test/fixtures/nested-test.js`',
      'ok 3 - "sub test3" - test #3 in `test/fixtures/nested-test.js`'
    )
    delete global.__results
    cb(er)
  })
}

