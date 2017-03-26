var helper = require('./support/helper')
var assert = require('core-assert')

module.exports = function (cb) {
  global.__results = []
  helper.run('safe/fixtures/returns-stuff.js', {
    plugins: ['safe/fixtures/result-plugin',
              'safe/fixtures/counter-plugin',
              'safe/fixtures/gather-results-plugin']
  }, function (er, result, log) {
    assert.equal(result, true)
    log.assert(
      'TAP version 13',
      '1..2',
      'ok 1 - "sync" - test #1 in `safe/fixtures/returns-stuff.js`',
      'ok 2 - "async" - test #2 in `safe/fixtures/returns-stuff.js`'
    )

    var stuff = global.__results[0]
    assert.equal(stuff.value, 'stuff')
    assert.deepEqual(stuff.plugins.result, {
      value: 'Result: stuff',
      error: undefined
    })
    assert.deepEqual(stuff.plugins.counter, {
      value: 5,
      error: undefined
    })
    assert.deepEqual(stuff.plugins['gather-results'], {
      value: undefined,
      error: undefined
    })

    var otherStuff = global.__results[1]
    assert.equal(otherStuff.value, 'other stuff')
    assert.deepEqual(otherStuff.plugins.result, {
      value: 'Result: other stuff',
      error: undefined
    })
    assert.deepEqual(otherStuff.plugins.counter, {
      value: 10,
      error: undefined
    })
    assert.deepEqual(otherStuff.plugins['gather-results'], {
      value: undefined,
      error: undefined
    })

    delete global.__results
    cb(er)
  })
}

