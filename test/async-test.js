var _ = require('lodash')
var helper = require('./support/helper')
var assert = require('assert')

// Just the passing tests
helper.run('test/fixtures/async-good-test.jsxxx', function(er, result) {
  assert.equal(result, true)
  helper.assertLog(
    "TAP version 13",
    "1..1",
    "ok 1 - \"aTest\" - test #1 in `test/fixtures/async-good-test.js`"
  )
})


// all the async tests
helper.run('test/fixtures/async-*.jsxxx', function(er, result) {
  assert.equal(result, false)
  helper.assertLog(
    "TAP version 13",
    "1..3",
    "not ok 1 - test #1 in `test/fixtures/async-good-test.js`",
    "not ok 2 - \"aTest\" - in `test/fixtures/async-good-test.js`",
    "ok 3 - \"aTest\" - test #1 in `test/fixtures/async-good-test.js`"
  )
})

