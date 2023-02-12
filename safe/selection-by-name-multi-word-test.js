const helper = require('./support/helper')
const assert = require('core-assert')

module.exports = function canSelectTestByName (cb) {
  helper.run('example/simple-node/test/lib/multi-word-names.js#a long passing test name', function (er, result, log) {
    assert.equal(result, true)
    log.assert(
      'TAP version 13',
      '1..1',
      'ok 1 - "a long passing test name" - test #1 in `example/simple-node/test/lib/multi-word-names.js`'
    )
    assert(log.toString().indexOf('failing') === -1, 'The other test ran!')
    cb(er)
  })
}
