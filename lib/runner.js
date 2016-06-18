var _ = require('lodash')
var wrap = require('./plugins/wrap')
var results = require('./plugins/internal/results')
var pluginsStore = require('./plugins/store')

var donePlugin = require('./plugins/internal/done')
var uncaughtExceptionPlugin = require('./plugins/internal/uncaught-exception')
var timeoutPlugin = require('./plugins/internal/timeout')

module.exports = function (action, log, timeout, cb) {
  var runnerResults = results(log)

  pluginsStore.register(donePlugin())
  pluginsStore.register(uncaughtExceptionPlugin())
  pluginsStore.register(timeoutPlugin(timeout))
  pluginsStore.register(runnerResults.plugin)

  wrapCallablesInTree(action)

  action.callable(function (e) {
    if (e) { return cb(e, false) }
    cb(null, runnerResults.isPassing())
  })
}

var wrapCallablesInTree = function (node) {
  node.callable = wrap(node).callable
  if (node.children) {
    _.each(node.children, wrapCallablesInTree)
  }
}
