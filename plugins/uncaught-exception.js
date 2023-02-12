const _ = require('lodash')

module.exports = function () {
  return {
    name: 'teenytest-uncaught-exception',
    supervisors: {
      userFunction: function (runUserFunction, metadata, cb) {
        const onceCb = _.once(cb)
        const uncaughtErrorHandler = function uncaughtErrorHandler (er) {
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
