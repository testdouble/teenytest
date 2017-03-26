var glob = require('glob')
var path = require('path')
var _ = require('lodash')

function noOpHook () {}
var HOOK_NAMES = ['beforeEach', 'beforeAll', 'afterEach', 'afterAll']

module.exports = function (globPattern, cwd) {
  return _.map(glob.sync(globPattern), function (file) {
    var testPath = path.resolve(cwd, file)
    var testModule = require(testPath)

    return buildExampleGroup(testPath, testModule, file, [{name: 'global'}])
  })
}

function buildExampleGroup (name, groupDeclaration, file, ancestors) {
  return _.tap({
    name: name,
    type: 'suite',
    file: file,
    beforeAll: groupDeclaration.beforeAll || noOpHook,
    afterAll: groupDeclaration.afterAll || noOpHook,
    beforeEach: groupDeclaration.beforeEach || noOpHook,
    afterEach: groupDeclaration.afterEach || noOpHook,
    ancestorNames: _.map(ancestors, 'name')
  }, function (exampleGroup) {
    _.assign(exampleGroup, {
      items: itemsIn(groupDeclaration, file, ancestors.concat(exampleGroup))
    })
  })
}

var itemsIn = function (groupDeclaration, file, ancestors) {
  if (_.isFunction(groupDeclaration)) {
    return [buildTest(groupDeclaration.name, groupDeclaration, file, ancestors)]
  } else {
    return _(groupDeclaration).map(function (item, name) {
      if (_.includes(HOOK_NAMES, name)) {
        return undefined
      } else if (_.isFunction(item)) {
        return buildTest(name, item, file, ancestors)
      } else if (_.isPlainObject(item)) {
        return buildExampleGroup(name, item, file, ancestors)
      }
    }).compact().value()
  }
}

function buildTest (name, testFunction, file, ancestors) {
  return _.tap({
    name: name,
    type: 'test',
    testFunction: testFunction,
    context: Object.create(null),
    file: file,
    ancestorNames: _.map(ancestors, 'name')
  }, function (test) {
    _.assign(test, {
      description: function (suiteOrdinal, fileOrdinal) {
        return testDescription(test, suiteOrdinal, fileOrdinal)
      }
    })
  })
}

function testDescription (test, suiteOrdinal, fileOrdinal) {
  var fullName = _.drop(test.ancestorNames, 2).concat(test.name).join(' ')
  return suiteOrdinal + ' - ' +
         (fullName ? '"' + fullName + '" - ' : '') +
         'test #' + fileOrdinal +
         ' in `' + test.file + '`'
}
