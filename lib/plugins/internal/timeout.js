var _ = require('lodash')

module.exports = function (intervalLengthInMs, timeoutInMs) {
  return {
    name: 'teenytest-timeout',
    wrappers: {
      test: function (runTest, metadata, cb) {
        var timedOut = false
        var timer = setTimeout(function outtaTime () {
          var timedOut = true
          cb(new Error('Test timed out! (timeout: ' + timeoutInMs + ')'))
        }, timeoutInMs)

        runTest(function timerWrappedCallback (er) {
          if (!timedOut) {
            clearTimeout(timer)
            cb(er)
          }
        })
      }
    }
  }
}
