var _ = require('lodash')
var helper = require('./support/helper')
var assert = require('assert')

var result = helper.run('test/fixtures/context-*.js')

assert.equal(result, false)
helper.assertLog(
  "TAP version 13",
  "1..2",
  "ok 1 - \"adds\" - test #1 in `example/test/lib/exporting-an-object.js`",
  "ok 2 - \"subtracts\" - test #2 in `example/test/lib/exporting-an-object.js`"
)

