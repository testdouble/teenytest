const async = require('async')
const doubleResolve = require('./double-resolve')
const _ = require('lodash')

const pluginsStore = require('../plugins/store')

module.exports = function (cwd, pluginPaths, cb) {
  async.each(pluginPaths, function (pluginPath, cb) {
    doubleResolve(pluginPath, { basedir: cwd }, function (er, fullPluginPath) {
      if (er) return cb(er)
      const plugin = require(fullPluginPath)
      pluginsStore.register(_.isFunction(plugin) ? plugin() : plugin)
      cb(null)
    })
  }, cb)
}
