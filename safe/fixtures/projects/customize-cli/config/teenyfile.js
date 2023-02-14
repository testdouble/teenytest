const otherPrinterPlugin = require('../../vanilla/plugins/other-printer')

module.exports = function (teenytest, cb) {
  teenytest.plugins.register(otherPrinterPlugin)
  cb(null)
}
