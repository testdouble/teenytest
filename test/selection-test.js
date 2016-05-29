var helper = require('./support/helper')
var assert = require('assert')

module.exports = function canSelectTestByName (cb) {
  helper.run('example/test/lib/exporting-an-object.js#adds', function (er, result, log) {
    var theLog = log.read().join('')
    assert(theLog.indexOf('adds') > -1, '#adds should be run')
    assert(theLog.indexOf('subtracts') === -1, '#subtracts should not be run')
    cb(er)
  })
}
