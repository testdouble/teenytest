var _ = require('lodash')
var async = require('async')
var wrap = require('./plugins/wrap')
var results = require('./plugins/internal/results')
var pluginStore = require('./plugins/store')

module.exports = function (action, log, cb) {
  var runnerResults = results(log)
  pluginStore.register(runnerResults.plugin)

  wrapCallablesInTree(action).callable(function (e) {
    if (e) { return cb(e, false) }
    cb(null, runnerResults.isPassing())
  })
}

var wrapCallablesInTree = function (node) {
  node.callable = wrap(node.callable, node.type)
  if(node.children) {
    _.each(node.children, wrapCallablesInTree)
  }
}
