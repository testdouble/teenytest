var pluginsStore = require('../plugins/store')

var donePlugin = require('../../plugins/done')
var uncaughtExceptionPlugin = require('../../plugins/uncaught-exception')
var timeoutPlugin = require('../../plugins/timeout')
var resultsPlugin = require('../../plugins/results')
var tap13Plugin = require('../../plugins/tap13')

module.exports = function (options) {
  pluginsStore.register(donePlugin())
  pluginsStore.register(uncaughtExceptionPlugin())
  pluginsStore.register(timeoutPlugin(options.asyncTimeout))
  pluginsStore.register(resultsPlugin())
  pluginsStore.register(tap13Plugin(options.output))
}
