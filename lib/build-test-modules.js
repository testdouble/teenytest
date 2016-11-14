var glob = require('glob')
var path = require('path')
var _assign = require('lodash/assign')
var _drop = require('lodash/drop')
var _identity = require('lodash/identity')
var _includes = require('lodash/includes')
var _isFunction = require('lodash/isFunction')
var _isPlainObject = require('lodash/isPlainObject')
var _map = require('lodash/map')
var _tap = require('lodash/tap')

function noOpHook () {}
var HOOK_NAMES = ['beforeEach', 'beforeAll', 'afterEach', 'afterAll']

module.exports = function (globPattern, cwd) {
  return _map(glob.sync(globPattern), function (file) {
    var testPath = path.resolve(cwd, file)
    var testModule = require(testPath)

    return buildExampleGroup(testPath, testModule, file, [{name: 'global'}])
  })
}

function buildExampleGroup (name, groupDeclaration, file, ancestors) {
  return _tap({
    name: name,
    type: 'suite',
    file: file,
    beforeAll: groupDeclaration.beforeAll || noOpHook,
    afterAll: groupDeclaration.afterAll || noOpHook,
    beforeEach: groupDeclaration.beforeEach || noOpHook,
    afterEach: groupDeclaration.afterEach || noOpHook,
    ancestorNames: _map(ancestors, 'name')
  }, function (exampleGroup) {
    _assign(exampleGroup, {
      items: itemsIn(groupDeclaration, file, ancestors.concat(exampleGroup))
    })
  })
}

var itemsIn = function (groupDeclaration, file, ancestors) {
  if (_isFunction(groupDeclaration)) {
    return [buildTest(groupDeclaration.name, groupDeclaration, file, ancestors)]
  } else {
    return _map(groupDeclaration, function (item, name) {
      if (_includes(HOOK_NAMES, name)) {
        return undefined
      } else if (_isFunction(item)) {
        return buildTest(name, item, file, ancestors)
      } else if (_isPlainObject(item)) {
        return buildExampleGroup(name, item, file, ancestors)
      }
    }).filter(_identity)
  }
}

function buildTest (name, testFunction, file, ancestors) {
  return _tap({
    name: name,
    type: 'test',
    testFunction: testFunction,
    context: Object.create(null),
    file: file,
    ancestorNames: _map(ancestors, 'name')
  }, function (test) {
    _assign(test, {
      description: function (suiteOrdinal, fileOrdinal) {
        return testDescription(test, suiteOrdinal, fileOrdinal)
      }
    })
  })
}

function testDescription (test, suiteOrdinal, fileOrdinal) {
  var fullName = _drop(test.ancestorNames, 2).concat(test.name).join(' ')
  return suiteOrdinal + ' - ' +
         (fullName ? '"' + fullName + '" - ' : '') +
         'test #' + fileOrdinal +
         ' in `' + test.file + '`'
}
