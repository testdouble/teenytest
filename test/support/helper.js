var _ = require('lodash')
var assert = require('assert')

var logger = require('./logger')
var teenytest = require('../../index')

module.exports = {
  run: function(glob, config){
    ogConsoleLog = console.log
    console.log = logger
    logger.reset()
    var result = teenytest(glob, _.assign({}, {
      output: logger
    }, config))
    console.log = ogConsoleLog
    return result
  },
  log: function() { return logger.read() },
  assertLog: function() {
    var lines = _.toArray(arguments),
        log = this.log()

    _.each(lines, function(line, i) {
      if(line instanceof RegExp) {
        assert(line.test(log[i]), line.toString() + ' did not match: "' +log[i]+'"')
      } else {
        assert.equal(log[i], line)
      }
    })
  }
}
