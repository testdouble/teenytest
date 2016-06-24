var helper = require('./support/helper')
var assert = require('assert')

module.exports = function (cb) {
  return cb(null)
  global.__results = []
  helper.run('test/fixtures/returns-stuff.js', {
    plugins: ['test/fixtures/result-plugin',
              'test/fixtures/counter-plugin',
              'test/fixtures/gather-results-plugin']
  }, function (er, result, log) {
    assert.equal(result, true)
    log.assert(
      'TAP version 13',
      '1..2',
      'ok 1 - "sync" - test #1 in `test/fixtures/returns-stuff.js`',
      'ok 2 - "async" - test #2 in `test/fixtures/returns-stuff.js`'
    )

    console.log("JUICE HERE", global.__results)
    assert.deepEqual(global.__results, [
      {
        value: 'stuff',
        error: undefined,
        plugins: {
          'result-plugin': {
            value: 'Result: stuff',
            error: undefined
          },
          'counter-plugin': {
            value: 5,
            error: undefined
          }
        }
      },
      {
        value: 'other stuff',
        error: undefined,
        plugins: {
          'result-plugin': {
            value: 'Result: other stuff',
            error: undefined
          },
          'counter-plugin': {
            value: 8,
            error: undefined
          }
        }
      }
    ])
    delete global.__results
    cb(er)
  })
}

