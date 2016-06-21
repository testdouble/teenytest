var _ = require('lodash')
var wrap = require('../plugins/wrap')

var resultsStore = require('../report/results-store')
var errorStore = require('../report/error-store')
var registerBuiltInPlugins = require('./register-built-in-plugins')
var registerUserPlugins = require('./register-user-plugins')

module.exports = function (action, options, cb) {
  resultsStore.initialize()
  errorStore.initialize()

  registerBuiltInPlugins(options)

  registerUserPlugins(options.cwd, options.plugins, function (er) {
    if (er) return cb(er)

    wrapCallablesInTree(action)

    action.callable(function (e) {
      if (e) { return cb(e, false) }
      cb(null, resultsStore.isPassing())
    })
  })
}

var wrapCallablesInTree = function (node) {
  node.callable = wrap(node).callable
  if (node.children) {
    _.each(node.children, wrapCallablesInTree)
  }
}
