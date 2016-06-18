var _ = require('lodash')
var Tap13 = require('../../report/tap13')
var resultsStore = require('../../report/results-store')

/**
 * This plugin should be passed the teenytest logger and loaded
 *   absolutely last after all other plugins, because it'll intentionally
 *   swallow the errors of all teenytest user actions in order to properly
 *   log the test success, failure & error output
 */
module.exports = function (log) {
  var tap13 = new Tap13(log)
  resultsStore.initialize()

  return {
    plugin: {
      name: 'teenytest-results',
      sticky: false,
      analyzers: {
        userFunction: function (runUserFunction, metadata, cb) {
          if (!shouldBeRun(resultsStore, metadata)) return cb(null)

          runUserFunction(function (er) {
            if (er) {
              resultsStore.markFailure(metadata, er)
              if (!metadata.isAssociatedWithATest) {
                tap13.error(er, metadata.description)
              }
            }
            cb(null)
          })
        },
        test: function (runTest, metadata, cb) {
          if (resultsStore.currentTestHasFailed()) {
            tap13.test(metadata.description, {pass: false, skip: true})
            return cb(null)
          }
          resultsStore.nest(metadata)
          runTest(function (er) {
            if (er) {
              resultsStore.markFailure(metadata, er)
            }

            tap13.test(metadata.description, {
              pass: !resultsStore.currentTestHasFailed()
            })

            var errorsToPrint = resultsStore.deepestErrorsAssociatedWithATest()
            _.each(errorsToPrint, function (er) { tap13.error(er) })

            resultsStore.unNest()
            cb(null)
          })
        },
        suite: function (runSuite, metadata, cb) {
          if (resultsStore.currentTestSetUpFailed()) return cb(null)
          resultsStore.nest(metadata)
          runSuite(function (er) {
            if (er) {
              resultsStore.markFailure(metadata, er)
              tap13.error(er, 'suite: "' + metadata.name + '" in ' +
                              '`' + metadata.file + '`')
            }
            resultsStore.unNest()
            cb(null)
          })
        }
      }
    },
    isPassing: resultsStore.isPassing
  }
}

function shouldBeRun (resultsStore, metadata) {
  return !resultsStore.currentTestHasFailed() ||
         (
           metadata.hookType === 'afterEach' &&
           resultsStore.afterEachCleanupNecessary(metadata.distanceFromTest)
         ) ||
         metadata.hookType === 'afterAll'
}

