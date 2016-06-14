var _ = require('lodash')

module.exports = function (timeoutInMs) {
  return {
    name: 'teenytest-timeout',
    wrappers: {
      test: function (runTest, metadata, cb) {
        var onceCb = _.once(cb)
        var timedOut = false
        var timer = setTimeout(function outtaTime () {
          var timedOut = true
          onceCb(new Error('Test timed out! (timeout: ' + timeoutInMs + 'ms)'))
        }, timeoutInMs)

        runTest(function timerWrappedCallback (er) {
          if (!timedOut) {
            clearTimeout(timer)
            onceCb(er)
          }
        })
      }
    }
  }
}
