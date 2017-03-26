var helper = require('./support/helper')
var assert = require('core-assert')

module.exports = function canSelectTestByName (cb) {
  helper.run('example/simple-node/test/lib/exporting-an-object.js#adds', function (er, result, log) {
    assert.equal(result, true)
    log.assert(
      'TAP version 13',
      '1..1',
      'ok 1 - "adds" - test #1 in `example/simple-node/test/lib/exporting-an-object.js`'
    )
    assert(log.toString().indexOf('subtracts') === -1,
      '#subtracts should not be run, but was')
    cb(er)
  })
}
