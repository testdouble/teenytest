var fs = require('fs')
var path = require('path')

module.exports = function (cb) {
  var packagePath = path.resolve(process.cwd(), 'package.json')
  fs.exists(packagePath, function (exists) {
    cb(null, exists ? require(packagePath).teenytest : undefined)
  })
}

