var _ = require('lodash')
var helper = require('./support/helper')
var assert = require('assert')

var result = helper.run('test/fixtures/context-*.js')

assert.equal(result, true)
helper.assertLog(
  "TAP version 13",
  "1..2",
  "ok 1 - \"test1\" - test #1 in `test/fixtures/context-test.js`",
  "ok 2 - \"test2\" - test #2 in `test/fixtures/context-test.js`"
)

