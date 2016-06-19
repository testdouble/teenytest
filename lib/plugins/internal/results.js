var resultsStore = require('../../report/results-store')

module.exports = function () {
  return {
    name: 'teenytest-results',
    analyzers: {
      userFunction: function (runUserFunction, metadata, cb) {
        if (!shouldBeRun(resultsStore, metadata)) return cb(null)

        runUserFunction(function (er) {
          if (er) {
            resultsStore.markFailure(metadata, er)
          }
          cb(null)
        })
      },
      test: buildResultsForTestOrSuiteScoping,
      suite: buildResultsForTestOrSuiteScoping
    }
  }
}

function buildResultsForTestOrSuiteScoping (runTestOrSuite, metadata, cb) {
  resultsStore.nest(metadata)

  if (resultsStore.currentTestSetUpFailed()) {
    resultsStore.failTest(metadata)
    resultsStore.skipTest(metadata)
    resultsStore.unNest()
    cb(null)
  } else {
    runTestOrSuite(function (er) {
      if (er) {
        resultsStore.markFailure(metadata, er)
      }
      resultsStore.unNest()
      cb(null)
    })
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

