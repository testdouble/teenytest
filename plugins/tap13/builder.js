var _ = require('lodash')

function Tap13 (log) {
  this.log = log
  this.errorsLogged = []
}
module.exports = Tap13

Tap13.prototype.prelude = function (testCount) {
  this.log('TAP version 13')
  this.log('1..' + testCount)
}

Tap13.prototype.test = function (description, info) {
  this.log((info.passing ? '' : 'not ') + 'ok ' +
           description +
           (info.skipped ? ' [SKIPPED]' : ''))
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

Tap13.prototype.summarize = function (summary) {
  this.log('# Test run ' + (summary.failed === 0 ? 'passed!' : 'failed!'))
  this.log('#   Run:    ' + summary.total)
  this.log('#   Passed: ' + summary.passed)
  this.log('#   Failed: ' + summary.failed)
}
