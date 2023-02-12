const _ = require('lodash')
const wrap = require('../plugins/wrap')

const store = require('../store')
const resultsStore = require('./results-store')
const registerBuiltInPlugins = require('./register-built-in-plugins')
const registerUserPlugins = require('./register-user-plugins')
const runCustomConfigurator = require('./run-custom-configurator')

module.exports = function (rootAction, options, cb) {
  const log = options.output
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

const wrapCallablesInTree = function (node) {
  node.callable = wrap(node).callable
  if (node.children) {
    _.each(node.children, wrapCallablesInTree)
  }
}
