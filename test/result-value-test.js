var helper = require('./support/helper')
var assert = require('assert')

module.exports = function (cb) {
  global.__results = []
  helper.run('test/fixtures/returns-stuff.js', {
    plugins: ['test/fixtures/result-plugin']
  }, function (er, result, log) {
    assert.equal(result, true)
    log.assert(
      'TAP version 13',
      '1..2',
      'ok 1 - "sync" - test #1 in `test/fixtures/returns-stuff.js`',
      'ok 2 - "async" - test #2 in `test/fixtures/returns-stuff.js`'
    )
    assert.deepEqual(global.__results, [
      'Result: stuff',
      'Result: other stuff'
    ])
    delete global.__results
    cb(er)
  })
}

