var printerPlugin = require('../plugins/printer')
var otherPrinterPlugin = require('../plugins/other-printer')

var assert = require('core-assert')

module.exports = function (teenytest, cb) {
  // Do some shenanigans to verify things work as expected
  teenytest.plugins.unregisterAll()
  assert.strictEqual(0, teenytest.plugins.wrappers('userFunction').length)
  assert.strictEqual(0, teenytest.plugins.wrappers('test').length)
  assert.strictEqual(0, teenytest.plugins.wrappers('suite').length)

  teenytest.plugins.register(printerPlugin())
  teenytest.plugins.register(otherPrinterPlugin)

  teenytest.plugins.register(require('../../../../../plugins/uncaught-exception')())
  teenytest.plugins.register(require('../../../../../plugins/timeout')(5000))
  teenytest.plugins.register(require('../../../../../plugins/results')())
  teenytest.plugins.register(require('../../../../../plugins/tap13')(console.log))

  cb(null)
}
