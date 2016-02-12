module.exports = function(func, context, intervalLengthInMs, timeoutInMs, cb) {
  var isDone = false,
      elapsed = 0,
      error = null
      doneCb = function(er) {
        isDone = true
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
  func.call(context, doneCb)
}
