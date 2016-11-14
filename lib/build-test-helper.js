var _assign = require('lodash/assign')
var _defaults = require('lodash/defaults')
var fs = require('fs')
var path = require('path')

function noOpHook () {}

module.exports = function (helperPath, cwd) {
  return _defaults(buildUserHelper(helperPath, cwd), {
    beforeAll: noOpHook,
    afterAll: noOpHook,
    beforeEach: noOpHook,
    afterEach: noOpHook,
    options: {}
  })
}

function buildUserHelper (helperPath, cwd) {
  if (helperPath && fs.existsSync(helperPath)) {
    return _assign({}, require(path.resolve(cwd, helperPath)), {
      file: helperPath
    })
  }
}

