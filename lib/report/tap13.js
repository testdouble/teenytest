var _ = require('lodash')

function Tap13 (log) {
  this.log = log
}
module.exports = Tap13

Tap13.prototype.test = function (description, info) {
  this.log((info.pass ? '' : 'not ') + 'ok ' +
           description +
           (info.skip ? ' [SKIPPED]' : ''))
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
