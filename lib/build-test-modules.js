var glob = require('glob')
var path = require('path')
var _ = require('lodash')

function noOpHook () {}
var HOOK_NAMES = ['beforeEach', 'beforeAll', 'afterEach', 'afterAll']

module.exports = function (globPattern, cwd) {
  return _.map(glob.sync(globPattern), function (file) {
    var testPath = path.resolve(cwd, file)
    var testModule = require(testPath)

    return buildExampleGroup('module', testModule, file, [])
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
  return _.tap({}, function (test) {
    _.assign(test, {
      testFunction: testFunction,
      name: name,
      context: Object.create(null),
      description: function (suiteOrdinal, fileOrdinal) {
        return testDescription(test, suiteOrdinal, fileOrdinal)
      },
      file: file,
      __teenytest__type: 'test',
      ancestors: ancestors
    })
  })
}

function buildExampleGroup (name, groupDeclaration, file, ancestors) {
  return _.tap({}, function (exampleGroup) {
    _.assign(exampleGroup, {
      items: itemsIn(groupDeclaration, file, ancestors.concat(exampleGroup)),
      file: file,
      name: name,
      beforeAll: groupDeclaration.beforeAll || noOpHook,
      afterAll: groupDeclaration.afterAll || noOpHook,
      beforeEach: groupDeclaration.beforeEach || noOpHook,
      afterEach: groupDeclaration.afterEach || noOpHook,
      __teenytest__type: 'group',
      ancestors: ancestors
    })
  })
}

function testDescription (test, suiteOrdinal, fileOrdinal) {
  var fullName = _.reduce(_.tail(test.ancestors), function (memo, ancestor) {
    return ancestor.name + ' ' + memo
  }, test.name)

  return suiteOrdinal + ' - ' +
         (fullName ? '"' + fullName + '" - ' : '') +
         'test #' + fileOrdinal +
         ' in `' + test.file + '`'
}
