var resolve = require('resolve')
var path = require('path')

/* This is more durable than the out-of-the-box resolve module, because users
 * can specify (for resident file <root>/config/teenytest.js:
 *
 * • './config/teenytest'
 * • 'config/teenytest'
 * • 'config/teenytest.js'
 *
 */
module.exports = function (somePath, opts, cb) {
  resolve(somePath, opts, function (er, resolvedPath) {
    if (er) {
      resolve(path.resolve(opts.basedir || process.cwd(), somePath), opts, cb)
    } else {
      cb(null, resolvedPath)
    }
  })
}
