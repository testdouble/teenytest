var printerPlugin = require('../plugins/printer')
var otherPrinterPlugin = require('../plugins/other-printer')

var assert = require('assert')

module.exports = function (teenytest, cb) {
  // Do some shenanigans to verify things work as expected
  teenytest.plugins.unregisterAll()
  assert.equal(0, teenytest.plugins.wrappers('userFunction'))
  assert.equal(0, teenytest.plugins.wrappers('test'))
  assert.equal(0, teenytest.plugins.wrappers('suite'))

  teenytest.plugins.register(printerPlugin())
  teenytest.plugins.register(otherPrinterPlugin)

  teenytest.plugins.register(require('../../../../plugins/done')())
  teenytest.plugins.register(require('../../../../plugins/uncaught-exception')())
  teenytest.plugins.register(require('../../../../plugins/timeout')(5000))
  teenytest.plugins.register(require('../../../../plugins/results')())
  teenytest.plugins.register(require('../../../../plugins/tap13')(console.log))

  cb(null)
}
