const pluginsStore = require('../plugins/store')

const uncaughtExceptionPlugin = require('../../plugins/uncaught-exception')
const timeoutPlugin = require('../../plugins/timeout')
const resultsPlugin = require('../../plugins/results')
const tap13Plugin = require('../../plugins/tap13')

module.exports = function (options) {
  pluginsStore.register(uncaughtExceptionPlugin())
  pluginsStore.register(timeoutPlugin(options.asyncTimeout))
  pluginsStore.register(resultsPlugin())
  pluginsStore.register(tap13Plugin(options.output))
}
