module.exports = function (timeoutInMs) {
  return {
    name: 'teenytest-timeout',
    supervisors: {
      test: function (runTest, metadata, cb) {
        let timedOut = false
        const timer = setTimeout(function outtaTime () {
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
