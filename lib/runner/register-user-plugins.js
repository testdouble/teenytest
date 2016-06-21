var async = require('async')
var resolve = require('resolve')
var _ = require('lodash')

var pluginsStore = require('../plugins/store')

module.exports = function (cwd, pluginPaths, cb) {
  async.each(pluginPaths, function (pluginPath, cb) {
    resolve(pluginPath, {basedir: cwd}, function (er, fullPluginPath) {
      if (er) return cb(er)
      var plugin = require(fullPluginPath)
      pluginsStore.register(_.isFunction(plugin) ? plugin() : plugin)
      cb(null)
    })
  }, cb)
}

