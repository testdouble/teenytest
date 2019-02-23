var _ = require('lodash')
var wrap = require('../plugins/wrap')

var store = require('../store')
var resultsStore = require('./results-store')
var registerBuiltInPlugins = require('./register-built-in-plugins')
var registerUserPlugins = require('./register-user-plugins')
var runCustomConfigurator = require('./run-custom-configurator')

module.exports = function (rootAction, options, cb) {
  var log = options.output
  store.initialize()

  registerBuiltInPlugins(options)

  registerUserPlugins(options.cwd, options.plugins, function (er) {
    if (er) return cb(er)
    runCustomConfigurator(options.cwd, options.configurator, function (er) {
      if (er) return cb(er)
      wrapCallablesInTree(rootAction)

      rootAction.callable(function (e) {
        if (e) {
          log('A fatal error occurred!')
          log('  ---')
          log(' ', e.stack || e.message || e)
          log('  ...')

          cb(e, false)
        } else {
          cb(null, resultsStore.isPassing())
        }
      })
    })
  })
}

var wrapCallablesInTree = function (node) {
  node.callable = wrap(node).callable
  if (node.children) {
    _.each(node.children, wrapCallablesInTree)
  }
}
