var _ = require('lodash')

module.exports = function () {
  return {
    name: 'teenytest-uncaught-exception',
    wrappers: {
      userFunction: function (runUserFunction, metadata, cb) {
        var onceCb = _.once(cb)
        var uncaughtErrorHandler = function uncaughtErrorHandler (er) {
          process.removeListener('uncaughtException', uncaughtErrorHandler)
          onceCb(er)
        }

        process.on('uncaughtException', uncaughtErrorHandler)

        runUserFunction(function (er) {
          process.removeListener('uncaughtException', uncaughtErrorHandler)
          onceCb(er)
        })
      }
    }
  }
}

