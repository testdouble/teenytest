var _ = require('lodash')

var Tap13 = require('../lib/report/tap13')
var countTests = require('../lib/count-tests')

module.exports = function (log) {
  var tap13 = new Tap13(log)
  var preludePrinted = false

  return {
    name: 'teenytest-tap13',
    reporters: {
      userFunction: function (runUserFunction, metadata, cb) {
        runUserFunction(function (er, result) {
          if (result.error && !metadata.isAssociatedWithATest) {
            tap13.error(result.error, metadata.description)
          }
          cb(er)
        })
      },
      test: function (runTest, metadata, cb) {
        runTest(function (er, result) {
          tap13.test(metadata.description, {
            passing: result.passing,
            skipped: result.skipped
          })

          _.each(result.errors, function (erObj) {
            tap13.error(erObj.error)
          })

          cb(er)
        })
      },
      suite: function (runSuite, metadata, cb) {
        if (!preludePrinted) {
          tap13.prelude(countTests(metadata))
          preludePrinted = true
        }
        runSuite(function (er, result) {
          _(result.errors).filter(['metadata', metadata]).map('error').each(function (er) {
            tap13.error(er, 'suite: "' + metadata.name + '" in ' +
                            '`' + metadata.file + '`')
          })
          cb(er)
        })
      }
    }
  }
}
