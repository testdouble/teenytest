module.exports = function (timeoutInMs) {
  return {
    name: 'teenytest-timeout',
    wrappers: {
      test: function (runTest, metadata, cb) {
        var timedOut = false
        var timer = setTimeout(function outtaTime () {
          timedOut = true
          cb(new Error('Test timed out! (timeout: ' + timeoutInMs + 'ms)'))
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
