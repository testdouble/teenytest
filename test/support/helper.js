var _ = require('lodash')
var assert = require('core-assert')

var loggerFactory = require('./logger-factory')
var teenytest = require('../../index')

module.exports = {
  run: function (glob, config, cb) {
    if (arguments.length < 3) { cb = config; config = {} }
    var logger = loggerFactory()

    teenytest(glob, _.assign({}, {
      output: logger.write
    }, config), function (er, result) {
      process.nextTick(function () {
        cb(er, result, logger)
      })
    })
  },
  includes: function (actual, expected) {
    try {
      assert(_.includes(actual, expected))
    } catch (e) {
      console.log('Failed, wanting actual:')
      console.log(actual)
      console.log('to have contained:')
      console.log(expected)
      console.log('---')
      throw e
    }
  },
  deepEqual: function (actual, expected, msg) {
    try {
      assert.deepEqual(actual, expected, msg)
    } catch (e) {
      console.log('Failed comparing actual:')
      console.log(actual)
      console.log('with expected:')
      console.log(expected)
      console.log('---')
      throw e
    }
  }
}
