var _ = require('lodash')
var fs = require('fs')
var path = require('path')

function noOpHook () {}

module.exports = function (helperPath, cwd) {
  return _.defaults(buildUserHelper(helperPath, cwd), {
    beforeAll: noOpHook,
    afterAll: noOpHook,
    beforeEach: noOpHook,
    afterEach: noOpHook,
    options: {}
  })
}

function buildUserHelper (helperPath, cwd) {
  if (helperPath && fs.existsSync(helperPath)) {
    return _.assign({}, require(path.resolve(cwd, helperPath)), {
      file: helperPath
    })
  }
}
