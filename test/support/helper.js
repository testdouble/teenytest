var _ = require('lodash')
var assert = require('assert')

var loggerFactory = require('./logger-factory')
var teenytest = require('../../index')

module.exports = {
  run: function(glob, config, cb){
    if(arguments.length < 3) { cb = config; config = {} }
    var logger = new loggerFactory()

    teenytest(glob, _.assign({}, {
      output: logger.write
    }, config), function(er, result){
      cb(er, result, logger)
    })
  }
}
