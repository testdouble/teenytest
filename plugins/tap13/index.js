const _ = require('lodash')

const Tap13 = require('./builder')
const countTests = require('./count-tests')
const Summary = require('./summary')

module.exports = function (log) {
  const tap13 = new Tap13(log)
  let preludePrinted = false
  const summary = new Summary()

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
          summary.logTest(metadata, result)
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
        let topLevelSuite = false
        if (!preludePrinted) {
          topLevelSuite = true
          tap13.prelude(countTests(metadata))
          preludePrinted = true
        }
        runSuite(function (er, result) {
          _(result.errors).filter(['metadata', metadata]).map('error').each(function (er) {
            tap13.error(er, 'suite: "' + metadata.name + '" in ' +
                            '`' + metadata.file + '`')
          })
          if (topLevelSuite) {
            tap13.summarize(summary)
          }
          cb(er)
        })
      }
    }
  }
}
