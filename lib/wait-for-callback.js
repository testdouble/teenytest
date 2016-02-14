module.exports = function (func, intervalLengthInMs, timeoutInMs, cb) {
  var isDone = false
  var elapsed = 0
  var error = null
  var uncaughtErrorHandler = function (e) {
    if (isDone) { return }
    doneCb(e)
  }
  var doneCb = function (er) {
    isDone = true
    process.removeListener('uncaughtException', uncaughtErrorHandler)
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

  process.on('uncaughtException', uncaughtErrorHandler)
  func(doneCb)
}
