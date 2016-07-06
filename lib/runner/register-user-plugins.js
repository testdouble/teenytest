var _isFunction = require('lodash/isFunction')
var async = require('async')
var doubleResolve = require('./double-resolve')

var pluginsStore = require('../plugins/store')

module.exports = function (cwd, pluginPaths, cb) {
  async.each(pluginPaths, function (pluginPath, cb) {
    doubleResolve(pluginPath, {basedir: cwd}, function (er, fullPluginPath) {
      if (er) return cb(er)
      var plugin = require(fullPluginPath)
      pluginsStore.register(_isFunction(plugin) ? plugin() : plugin)
      cb(null)
    })
  }, cb)
}

