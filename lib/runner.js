var _ = require('lodash')
var wrap = require('./plugins/wrap')
var results = require('./plugins/internal/results')
var pluginsStore = require('./plugins/store')

module.exports = function (action, log, cb) {
  var runnerResults = results(log)
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
