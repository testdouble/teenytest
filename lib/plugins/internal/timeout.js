var _ = require('lodash')

module.exports = function (intervalLengthInMs, timeoutInMs) {
  return {
    name: 'teenytest-timeout',
    wrappers: {
      userFunction: function (runUserFunction, metadata, cb) {
        var isDone = false
        var elapsed = 0
        var error = null
        var doneCb = function (er) {
          isDone = true
          if (er) {
            error = er
          }
        }
        var id = setInterval(function () {
          elapsed += intervalLengthInMs

          if (isDone === true) {
            clearInterval(id)
            cb(error)
          } else if (elapsed > timeoutInMs) {
            clearInterval(id)
            cb(new Error('Function timed out (timeout: ' + timeoutInMs + 'ms)'))
          }
        }, intervalLengthInMs)

        runUserFunction(doneCb)
      }
    }
  }
}
