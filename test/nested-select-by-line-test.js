var helper = require('./support/helper')
var assert = require('assert')

module.exports = function (cb) {
  helper.run('test/fixtures/nested-test.js#test3', function (er, result, log) {
    assert.equal(result, true)
    log.assert(
      'TAP version 13',
      '1..1',
      'ok 1 - "sub test3" - test #1 in `test/fixtures/nested-test.js`'
    )

    // Make sure all the hooks ran as expected
    assert.deepEqual(global.__results, [
      'A', // top beforeAll
      'D', //   sub beforeAll
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
