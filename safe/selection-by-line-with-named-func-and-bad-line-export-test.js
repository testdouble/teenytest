const helper = require('./support/helper')
const assert = require('core-assert')

module.exports = function (cb) {
  helper.run('safe/fixtures/single-named-func.js:123', function (er, result, log) {
    assert.equal(result, true)
    log.assert(
      'TAP version 13',
      '1..0'
    )
    cb(er)
  })
}
