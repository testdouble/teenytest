var doubleResolve = require('./double-resolve')

module.exports = function (cwd, configuratorPath, cb) {
  if (!configuratorPath) return cb(null)

  var teenytest = require('../../index')

  doubleResolve(configuratorPath, {basedir: cwd}, function (er, fullPath) {
    if (er) return cb(er)
    var configurator = require(fullPath)
    configurator(teenytest, cb)
  })
}
