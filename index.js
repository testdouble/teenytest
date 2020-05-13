var configure = require('./lib/configure')
var prepare = require('./lib/prepare')
var plan = require('./lib/plan')
var run = require('./lib/run')

module.exports = function (testLocator, userOptions, cb) {
  if (arguments.length < 3) { cb = userOptions; userOptions = {} }
  var config = configure(testLocator, userOptions)
  prepare(config)
    .then(function (prepared) {
      setImmediate(function () {
        run(plan(prepared), config, cb)
      })
    }, function (er) {
      var log = userOptions.output || console.log
      log(er.stack || String(er))
      setImmediate(function () {
        cb(er)
      })
    })
}

module.exports.plugins = require('./lib/plugins/store')
