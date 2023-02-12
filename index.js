const configure = require('./lib/configure')
const prepare = require('./lib/prepare')
const plan = require('./lib/plan')
const run = require('./lib/run')

module.exports = function (testLocator, userOptions, cb) {
  if (arguments.length < 3) { cb = userOptions; userOptions = {} }
  const config = configure(testLocator, userOptions)
  prepare(config)
    .then(function (prepared) {
      setImmediate(function () {
        run(plan(prepared), config, cb)
      })
    }, function (er) {
      const log = userOptions.output || console.log
      log(er.stack || String(er))
      setImmediate(function () {
        cb(er)
      })
    })
}

module.exports.plugins = require('./lib/plugins/store')
