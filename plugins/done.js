module.exports = function () {
  return {
    name: 'teenytest-done',
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
