var helper = require('./support/helper')
var assert = require('core-assert')

module.exports = {
  deepName: function (cb) {
    helper.run('safe/fixtures/deep-name.js#bar', function (er, result, log) {
      assert.equal(result, true)
      log.assert(
        'TAP version 13',
        '1..1',
        'ok 1 - "foo biz bar" - test #1 in `safe/fixtures/deep-name.js`'
      )
      cb(er)
    })
  },
  middleName: function (cb) {
    helper.run('safe/fixtures/deep-name.js#biz', function (er, result, log) {
      assert.equal(result, true)
      log.assert(
        'TAP version 13',
        '1..2',
        'ok 1 - "foo biz bar" - test #1 in `safe/fixtures/deep-name.js`',
        'ok 2 - "foo biz box" - test #2 in `safe/fixtures/deep-name.js`'
      )
      cb(er)
    })
  },
  fullName: function (cb) {
    helper.run('safe/fixtures/deep-name.js#biz bar', function (er, result, log) {
      assert.equal(result, true)
      log.assert(
        'TAP version 13',
        '1..1',
        'ok 1 - "foo biz bar" - test #1 in `safe/fixtures/deep-name.js`'
      )
      cb(er)
    })
  },
  deepLineNumber: function (cb) {
    helper.run('safe/fixtures/deep-name.js:7', function (er, result, log) {
      assert.equal(result, true)
      log.assert(
        'TAP version 13',
        '1..1',
        'ok 1 - "foo baz" - test #1 in `safe/fixtures/deep-name.js`'
      )
      cb(er)
    })
  }
}
