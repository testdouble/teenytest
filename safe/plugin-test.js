var helper = require('./support/helper')
var assert = require('core-assert')

var _ = require('lodash')

module.exports = function (finalCallbackPhew) {
  var configurator = function (teenytest, cb) {
    teenytest.plugins.register({
      name: 'pending',
      interceptors: {
        test: function (runTest, metadata, cb) {
          runTest(function pendingTest (er, result) {
            if (_.startsWith(metadata.name, 'pending')) {
              if (result.passing) {
                result.triggerFailure(new Error(
                  'Test "' + metadata.name + '" has "pending" in its name but it did' +
                  ' not fail! Perhaps you have yet to implement a failing test or' +
                  ' forgot to remove the pending flag?'
                ))
              } else {
                result.clearFailures()
              }
            }
            cb(er)
          })
        }
      }
    })

    teenytest.plugins.register({
      name: 'ignore',
      supervisors: {
        test: function (runTest, metadata, cb) {
          if (_.startsWith(metadata.name, 'ignore') ||
              _.some(metadata.ancestorNames, function (suiteName) {
                return _.startsWith(suiteName, 'ignore')
              })) {
            cb(null)
          } else {
            runTest(cb)
          }
        }
      }
    })
    cb(null)
  }

  helper.run('safe/fixtures/plugin-test.js', {
    configurator: configurator
  }, function (er, result, log) {
    assert.equal(result, false)
    log.assert(
      'TAP version 13',
      '1..5',
      'ok 1 - "ignoreThis" - test #1 in `safe/fixtures/plugin-test.js`',
      'ok 2 - "ignoreMyTest" - test #2 in `safe/fixtures/plugin-test.js`',
      'ok 3 - "ignoreMySuite andMe" - test #3 in `safe/fixtures/plugin-test.js`',
      'ok 4 - "pendingExplosion" - test #4 in `safe/fixtures/plugin-test.js`',
      'not ok 5 - "pendingButDone" - test #5 in `safe/fixtures/plugin-test.js`',
      '  ---',
      '  message: Test "pendingButDone" has "pending" in its name but it did' +
        ' not fail! Perhaps you have yet to implement a failing test or' +
        ' forgot to remove the pending flag?',
      /stacktrace: Error:/,
      '  ...'
    )
    finalCallbackPhew(er)
  })
}

