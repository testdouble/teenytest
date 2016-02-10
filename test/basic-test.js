var helper = require('./support/helper')
var assert = require('assert')

var result = helper.run('test/fixtures/basic-*.js'),
    log = helper.log()

assert.equal(result, true)
assert.deepStrictEqual(log, [
  'TAP version 13',
  '1..3',
  'ok 1 - test #1 in `test/fixtures/basic-test-passing-function.js`',
  'ok 2 - "bar" - test #1 in `test/fixtures/basic-test-passing-object.js`',
  'ok 3 - "baz" - test #2 in `test/fixtures/basic-test-passing-object.js`',
])
