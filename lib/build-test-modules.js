var glob = require('glob')
var path = require('path')
var _ = require('lodash')

function noOpHook () {}
var HOOK_NAMES = ['beforeEach', 'beforeAll', 'afterEach', 'afterAll']

module.exports = function (globPattern, cwd) {
  return _.map(glob.sync(globPattern), function (file) {
    var testPath = path.resolve(cwd, file)
    var testModule = require(testPath)

    return buildExampleGroup('module', testModule, file)
  })
}

var itemsIn = function (groupDeclaration, file) {
  if (_.isFunction(groupDeclaration)) {
    return [buildTest(groupDeclaration.name, groupDeclaration, file)]
  } else {
    return _(groupDeclaration).map(function (item, name) {
      if (_.includes(HOOK_NAMES, name)) {
        return undefined
      } else if (_.isFunction(item)) {
        return buildTest(name, item, file)
      } else if (_.isPlainObject(name)) {
        return buildExampleGroup(name, item, file)
      }
    }).compact().value()
  }
}

function buildTest (name, testFunction, file) {
  return {
    testFunction: testFunction,
    name: name,
    context: Object.create(null),
    description: function (suiteOrdinal, fileOrdinal) {
      return testDescription(file, name, suiteOrdinal, fileOrdinal)
    },
    file: file,
    __teenytest__type: 'test'
  }
}

function buildExampleGroup (name, groupDeclaration, file) {
  return {
    items: itemsIn(groupDeclaration, file),
    file: file,
    name: name,
    beforeAll: groupDeclaration.beforeAll || noOpHook,
    afterAll: groupDeclaration.afterAll || noOpHook,
    beforeEach: groupDeclaration.beforeEach || noOpHook,
    afterEach: groupDeclaration.afterEach || noOpHook,
    __teenytest__type: 'group'
  }
}

function testDescription (file, name, suiteOrdinal, fileOrdinal) {
  return suiteOrdinal + ' - ' +
         (name ? '"' + name + '" - ' : '') +
         'test #' + fileOrdinal +
         ' in `' + file + '`'
}
