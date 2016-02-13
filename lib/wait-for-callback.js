module.exports = function(func, context, intervalLengthInMs, timeoutInMs, cb) {
  var isDone = false,
      elapsed = 0,
      error = null,
      uncaughtErrorHandler = function(e) {
        if(isDone) { return }
        doneCb(e)
      }
      doneCb = function(er) {
        isDone = true
        process.removeListener('uncaughtException', uncaughtErrorHandler)
        if(er) {
          error = er
        }
      },
      id = setInterval(function(){
        elapsed += intervalLengthInMs

        if(isDone == true) {
          clearInterval(id)
          cb(error)
        } else if(elapsed > timeoutInMs) {
          clearInterval(id)
          cb(new Error('Function timed out (timeout: '+timeoutInMs+'ms)'))
        }
      }, intervalLengthInMs)

  process.on('uncaughtException', uncaughtErrorHandler)
  func.call(context, doneCb)
}
