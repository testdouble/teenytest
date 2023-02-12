const _ = require('lodash')

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

Tap13.prototype.error = function (e, standaloneDescription) {
  if (!_.isNil(standaloneDescription)) {
    this.log(' An error occurred in ' + standaloneDescription)
  }
  this.log('  ---')
  this.log(' ', e.stack || e.message || e)
  this.log('  ...')
}

Tap13.prototype.summarize = function (summary) {
  const p = this.log
  p('# Test run ' + (summary.failed === 0 ? 'passed!' : 'failed!'))
  p('#   Passed: ' + summary.passed)
  p('#   Failed: ' + summary.failed)
  p('#   Total:  ' + summary.total)

  if (summary.failures.length > 0) {
    p('#')
    p('# Failures:')
    _.each(summary.failures, function (failure) {
      p('#')
      p('#   ' + failure.description)
      if (failure.setUpFailed) {
        p('#')
        p('#     A setup hook (beforeEach or beforeAll) failed so the test never ran')
      }
      _.each(failure.errors, function (errorObj) {
        p('#')
        if (errorObj.error.stack) {
          p(_.map(errorObj.error.stack.split('\n'), function (stackLine) {
            return '#     ' + stackLine
          }).join('\n'))
        } else {
          p('#    Error: ' + errorObj.error)
        }
      })
    })
  }
}
