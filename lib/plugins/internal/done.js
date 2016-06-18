module.exports = function () {
  return {
    name: 'testdouble-done',
    sticky: true,
    translators: {
      userFunction: function (runUserFunction, metadata, cb) {
        if (runUserFunction.length === 0) {
          try {
            var result = runUserFunction()
            return cb(null, result)
          } catch (er) {
            return cb(er)
          }
        } else {
          runUserFunction(cb)
        }
      }
    }
  }
}
