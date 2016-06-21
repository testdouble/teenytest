var otherPrinterPlugin = require('../plugins/other-printer')

module.exports = function (teenytest) {
  teenytest.plugins.register(otherPrinterPlugin)
}
