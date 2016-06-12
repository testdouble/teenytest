var _ = require('lodash')

module.exports = function () {
  return {
    name: 'testdouble-done',
    sticky: true,
    wrappers: {
      userFunction: function (runUserFunction, metadata, cb) {
        if (runUserFunction.length === 0) {
          try {
            var result = runUserFunction()
            cb(null, result)
          } catch (er) {
            cb(er)
          }
        } else {
          runUserFunction(cb)
        }
      }
    }
  }
}
