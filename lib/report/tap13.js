var _ = require('lodash')

module.exports = Tap13 = function Tap13 (log) {
  this.log = log
}

Tap13.prototype.error = function (er, standaloneDescription) {
  if (!_.isNil(standaloneDescription)) {
    this.log(' An error occurred in ' + standaloneDescription)
  }
  this.log('  ---')
  this.log('  message: ' + er.message || er.toString())
  this.log('  stacktrace:', er.stack)
  this.log('  ...')

}
