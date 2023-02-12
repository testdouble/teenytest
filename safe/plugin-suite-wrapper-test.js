const helper = require('./support/helper')
const assert = require('core-assert')

module.exports = function (cb) {
  const configurator = function (teenytest, cb) {
    teenytest.plugins.register({
      name: 'woah the suite will fail',
      supervisors: {
        suite: function (runSuite, metadata, cb) {
          runSuite(function (er) {
            cb(new Error('lol'))
          })
        }
      }
    })
    cb(null)
  }
  helper.run('safe/fixtures/basic-test-passing-obj*.js', {
    configurator
  }, function (er, result, log) {
    assert.equal(result, false)
    log.assert(
      'TAP version 13',
      '1..2',
      'ok 1 - "bar" - test #1 in `safe/fixtures/basic-test-passing-object.js`',
      'ok 2 - "baz" - test #2 in `safe/fixtures/basic-test-passing-object.js`',
      / An error occurred in suite: /,
      '  ---',
      /Error: lol/,
      '  ...',
      ' An error occurred in suite: "global" in `(top-level)`',
      '  ---',
      /Error: lol/,
      '  ...'
    )
    cb(er)
  })
}
