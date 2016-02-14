var _ = require('lodash')
var path = require('path')

module.exports = function (helperPath, cwd) {
  return _.assign({}, {
    beforeAll: function () {},
    afterAll: function () {},
    beforeEach: function () {},
    afterEach: function () {},
    options: {}
  }, buildUserHelper(helperPath, cwd))
}

var buildUserHelper = function (helperPath, cwd) {
  if (!helperPath) { return {} }
  return _.assign({}, require(path.resolve(cwd, helperPath)), {
    file: helperPath
  })
}

