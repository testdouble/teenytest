var helper = require('./support/helper')
var assert = require('core-assert')

module.exports = function (cb) {
  helper.run('safe/fixtures/nested-test.js#sub', function (er, result, log) {
    assert.equal(result, true)
    log.assert(
      'TAP version 13',
      '1..2',
      'ok 1 - "sub test2" - test #1 in `safe/fixtures/nested-test.js`',
      'ok 2 - "sub test3" - test #2 in `safe/fixtures/nested-test.js`'
    )

    // Make sure all the hooks ran as expected
    assert.deepEqual(global.__results, [
      'A', // top beforeAll
      'D', //   sub beforeAll
      'B', // top beforeEach
      'E', //   sub beforeEach
      'F', //   "sub test 2"
      'H', //   sub afterEach
      'J', // top afterEach
      'B', // top beforeEach
      'E', //   sub beforeEach
      'G', //   "sub test 3"
      'H', //   sub afterEach
      'J', // top afterEach
      'I', //   sub afterAll
      'K' // top afterAll
    ])
    delete global.__results
    cb(er)
  })
}
