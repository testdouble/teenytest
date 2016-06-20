var _ = require('lodash')
var wrap = require('./plugins/wrap')

var resultsStore = require('./report/results-store')
var errorStore = require('./report/error-store')
var pluginsStore = require('./plugins/store')

var donePlugin = require('../plugins/done')
var uncaughtExceptionPlugin = require('../plugins/uncaught-exception')
var timeoutPlugin = require('../plugins/timeout')
var resultsPlugin = require('../plugins/results')
var tap13Plugin = require('../plugins/tap13')

module.exports = function (action, log, timeout, cb) {
  resultsStore.initialize()
  errorStore.initialize()

  pluginsStore.register(donePlugin())
  pluginsStore.register(uncaughtExceptionPlugin())
  pluginsStore.register(timeoutPlugin(timeout))
  pluginsStore.register(resultsPlugin())
  pluginsStore.register(tap13Plugin(log))

  wrapCallablesInTree(action)

  action.callable(function (e) {
    if (e) { return cb(e, false) }
    cb(null, resultsStore.isPassing())
  })
}

var wrapCallablesInTree = function (node) {
  node.callable = wrap(node).callable
  if (node.children) {
    _.each(node.children, wrapCallablesInTree)
  }
}
