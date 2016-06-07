var glob = require('glob')
var path = require('path')
var _ = require('lodash')

function noOpHook () {}

module.exports = function (globPattern, cwd) {
  return _.map(glob.sync(globPattern), function (file) {
    var testPath = path.resolve(cwd, file)
    var testModule = require(testPath)

    return buildExampleGroup('module', testModule, file)
  })
}

function buildExampleGroup (name, groupDeclaration, file) {
  var testFuncs = testFunctionsIn(groupDeclaration)
  var tests = _.map(testFuncs, function (testEntry, i) {
    return {
      testFunction: testEntry.testFunction,
      testName: testEntry.testName,
      context: Object.create(null),
      description: function (suiteOrdinal, fileOrdinal) {
        return  testDescription(suiteOrdinal, file, testEntry.testName, fileOrdinal)
      },
      file: file,
      __teenytest__type: 'test'
    }
  })

  return {
    tests: tests,
    file: file,
    name: name,
    beforeAll: groupDeclaration.beforeAll || noOpHook,
    afterAll: groupDeclaration.afterAll || noOpHook,
    beforeEach: groupDeclaration.beforeEach || noOpHook,
    afterEach: groupDeclaration.afterEach || noOpHook,
    __teenytest__type: 'group'
  }
}

var testFunctionsIn = function (testModule) {
  if (_.isFunction(testModule)) {
    return [{
      testFunction: testModule,
      testName: testModule.name
    }]
  } else {
    return _(testModule).functions()
      .without('beforeEach', 'beforeAll', 'afterEach', 'afterAll')
      .map(function (testName) {
        return {
          testFunction: testModule[testName],
          testName: testName
        }
      })
      .value()
  }
}

function specificationFor (testEntry, file, index) {
}

function testDescription (suiteOrdinal, file, testName, fileOrdinal) {
  return suiteOrdinal + ' - ' +
         (testName ? '"' + testName + '" - ' : '') +
         'test #' + fileOrdinal +
         ' in `' + file + '`'
}
