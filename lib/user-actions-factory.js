var waitForCallback = require('./wait-for-callback')
var _ = require('lodash')

module.exports = function (options) {
  var functions = {
    invoke: function (userFunction, testOrModule, cb, errorHandler) {
      var context = testOrModule ? testOrModule.context : {}
      if (userFunction.length === 0) {
        try {
          userFunction.call(context)
          cb(null)
        } catch (e) {
          if (errorHandler) {
            errorHandler(e, testOrModule)
            cb(null)
          } else {
            cb(e)
          }
        }
      } else {
        waitForCallback(userFunction, context, options.asyncInterval, options.asyncTimeout, function (e) {
          if (e) {
            if (errorHandler) {
              errorHandler(e, testOrModule)
              cb(null)
            } else {
              cb(e)
            }
          } else {
            cb(null)
          }
        })
      }
    },
    wrap: function (userFunction, testOrModule, errorLogger) {
      return _.assign(function (cb) {
        functions.invoke(userFunction, testOrModule, cb, errorLogger)
      }, {
        object: testOrModule
      })
    }
  }
  return functions
}

