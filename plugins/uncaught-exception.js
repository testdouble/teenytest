var _once = require('lodash/once')

module.exports = function () {
  return {
    name: 'teenytest-uncaught-exception',
    supervisors: {
      userFunction: function (runUserFunction, metadata, cb) {
        var onceCb = _once(cb)
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

