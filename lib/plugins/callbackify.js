const userFunctionStore = require('./user-function-store')

module.exports = function callbackify (metadata, func) {
  if (func.length > 0) {
    return function (cb) {
      func(function (error, value) {
        userFunctionStore.set(metadata, value, error)
        cb(error, value)
      })
    }
  } else {
    return function (cb) {
      let value, error
      try {
        value = func()
      } catch (er) {
        error = er
      }
      userFunctionStore.set(metadata, value, error)
      return cb(error, value)
    }
  }
}
