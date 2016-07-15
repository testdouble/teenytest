var _ = require('lodash/core')

var doubleResolve = require('./double-resolve')

module.exports = function (cwd, configurator, cb) {
  if (!configurator) return cb(null)
  var teenytest = require('../../index')

  if (_.isFunction(configurator)) {
    configurator(teenytest, cb)
  } else {
    doubleResolve(configurator, {basedir: cwd}, function (er, fullPath) {
      if (er) return cb(er)
      require(fullPath)(teenytest, cb)
    })
  }
}
