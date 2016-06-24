module.exports = function callbackify (func) {
  if (func.length > 0) {
    return func
  } else {
    return function (cb) {
      var value, error
      try {
        value = func()
      } catch (er) {
        error = er
      } finally {
        return cb(error, value)
      }
    }
  }
}

