var helper = require('./support/helper')
var assert = require('assert')

var _ = require('lodash')
var teenytest = require('../index')

/* This is a very complex test in four stages:
 * 1. Register two plugins, one for defining pending tests (pending tests blow up
 *    when they pass, b/c they're works in progress) and another for ignoring
 *    tests and suites.
 * 2. Run the tests with both plugins registered and see they behave correctly
 * 3. Disable the pending plugin and ensure that only it is unregistered
 * 4. Disable all plugins and ensure neither plugin behavior applies
 */

module.exports = function (finalCallbackPhew) {
  // 1. Register 2 plugins
  teenytest.plugins.register({
    name: 'pending',
    wrappers: {
      test: function (runTest, metadata, cb) {
        runTest(function pendingTest(er) {
          if (_.startsWith(metadata.name, 'pending') && !er) {
            // TODO Issue here is test-scoped plugins can't see any errors at all
            // TODO one solution may be to provide a second arg to plugins runTest
            // TODO cb that includes the results (nested passing + errors?)
            // TODO how would we do that?
            cb(new Error(
              'Test "' + metadata.name + '" has "pending" in its name but it did' +
              ' not fail! Perhaps you have yet to implement a failing test or' +
              ' forgot to remove the pending flag?'
            ))
          } else {
            cb(er)
          }
        })
      }
    }
  })

  teenytest.plugins.register({
    name: 'ignore',
    wrappers: {
      test: function (runTest, metadata, cb) {
        if (_.startsWith(metadata.name, 'ignore') ||
            _.some(metadata.suiteNames, function (suiteName) {
              return _.startsWith(suiteName, 'ignore')
            })) {
          cb(null)
        } else {
          runTest(cb)
        }
      }
    }
  })

  // 2. Run the tests with both plugins enabled
  helper.run('test/fixtures/plugin-test.js', function (er, result, log) {
    assert.equal(result, false)
    log.assert(
      'TAP version 13',
      '1..5',
      'ok 1 - "ignoreThis" - test #1 in `test/fixtures/plugin-test.js`',
      'ok 2 - "ignoreMyTest" - test #2 in `test/fixtures/plugin-test.js`',
      'ok 3 - "ignoreMySuite andMe" - test #3 in `test/fixtures/plugin-test.js`',
      'ok 4 - "pendingExplosion" - test #4 in `test/fixtures/plugin-test.js`',
      'not ok 5 - "pendingButDone" - test #5 in `test/fixtures/plugin-test.js`',
      '  ---',
      '  message: Test "pendingButDone" has "pending" in its name but it did' +
        ' not fail! Perhaps you have yet to implement a failing test or' +
        ' forgot to remove the pending flag?',
      /stacktrace: Error:/,
      '  ...'
    )

    // 3. Run the tests with just the pending plugin unregistered
    teenytest.plugins.unregister('pending')
    helper.run('test/fixtures/plugin-test.js', function (er, result, log) {
      assert.equal(result, false)
      log.assert(
        'TAP version 13',
        '1..5',
        'ok 1 - "ignoreThis" - test #1 in `test/fixtures/plugin-test.js`',
        'ok 2 - "xMyTest" - test #2 in `test/fixtures/plugin-test.js`',
        'ok 3 - "uhIgnoreMe andMe" - test #3 in `test/fixtures/plugin-test.js`',
        'not ok 4 - "explosionPending" - test #4 in `test/fixtures/plugin-test.js`',
          '  ---',
          '  message: KABOOM!',
          /stacktrace: Error: KABOOM/,
          '  ...',
        'ok 5 - "pendingButDone" - test #5 in `test/fixtures/plugin-test.js`'
      )

      // 4. Run the tests with all plugins unregistered
      teenytest.plugins.unregisterAll()
      helper.run('test/fixtures/plugin-test.js', function (er, result, log) {
        assert.equal(result, false)
        log.assert(
          'TAP version 13',
          '1..5',
          'not ok 1 - "ignoreThis" - test #1 in `test/fixtures/plugin-test.js`',
            '  ---',
            '  message: Ignore me!',
            /stacktrace: Error: /,
            '  ...',
          'not ok 2 - "xMyTest" - test #2 in `test/fixtures/plugin-test.js`',
            '  ---',
            '  message: No!',
            /stacktrace: Error: /,
            '  ...',
          'An error occurred in test hook: uhIgnoreMe beforeEach defined in `test/fixtures/plugin-test.js`',
            '  ---',
            '  message: Bad hook do not run!',
            /stacktrace: Error: /,
            '  ...',
          //TODO: this ought to be "not ok" -- see https://github.com/testdouble/teenytest/issues/16
          'ok 3 - "uhIgnoreMe andMe" - test #3 in `test/fixtures/plugin-test.js`',
          'not ok 4 - "explosionPending" - test #4 in `test/fixtures/plugin-test.js`',
            '  ---',
            '  message: KABOOM!',
            /stacktrace: Error: KABOOM/,
            '  ...',
          'ok 5 - "pendingButDone" - test #5 in `test/fixtures/plugin-test.js`'
        )

        finalCallbackPhew(er)
      })
    })
  })
}

