var fs = require('fs')
var path = require('path')

module.exports = function (cb) {
  var packagePath = path.resolve(process.cwd(), 'package.json')
  fs.exists(packagePath, function (exists) {
    if (!exists) return cb(null)
    var opts = require(packagePath).teenytest
    if (!opts) return cb(null)

    cb(null, {
      testLocator: opts.testLocator,
      helperPath: opts.helper,
      asyncTimeout: opts.timeout,
      configurator: opts.configurator,
      plugins: opts.plugins
    })
  })
}
