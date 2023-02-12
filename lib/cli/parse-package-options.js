const fs = require('fs')
const path = require('path')

module.exports = function (cb) {
  const packagePath = path.resolve(process.cwd(), 'package.json')
  fs.stat(packagePath, function (er) {
    if (er) return cb(null)
    const opts = require(packagePath).teenytest
    if (!opts) return cb(null)

    cb(null, {
      testLocator: opts.testLocator,
      name: [],
      helperPath: opts.helper,
      asyncTimeout: opts.timeout,
      configurator: opts.configurator,
      plugins: opts.plugins
    })
  })
}
