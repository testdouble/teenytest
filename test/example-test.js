var _ = require('lodash')
var helper = require('./support/helper')
var assert = require('assert')

ogConsoleLog = console.log
var result = helper.run('example/test/lib/**/*.js'),
    log = helper.log()

assert.equal(result, false)
helper.assertLog(
  "TAP version 13",
  "1..3",
  "I'll run once before both tests",
  "I'll run twice - once before each test",
  "ok 1 - \"adds\" - test #1 in `example/test/lib/exporting-an-object.js`",
  "I'll run twice - once after each test",
  "I'll run twice - once before each test",
  "ok 2 - \"subtracts\" - test #2 in `example/test/lib/exporting-an-object.js`",
  "I'll run twice - once after each test",
  "I'll run once after both tests",
  "not ok 3 - \"blueIsRed\" - test #1 in `example/test/lib/single-function.js`",
  "  ---",
  "  message: 'blue' == 'red'",
  /  stacktrace: AssertionError: \'blue\' == \'red\'\n    at blueIsRed /,
  "  ..."
)
