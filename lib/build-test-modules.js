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
      type: 'test',
      context: Object.create(null),
      description: function (ordinal) {
        return ordinal + ' - ' + testSummaryDescription(file, testEntry.testName, i)
      },
      file: file
    }
  })

  return {
    tests: tests,
    file: file,
    name: name,
    type: 'group',
    beforeAll: groupDeclaration.beforeAll || noOpHook,
    afterAll: groupDeclaration.afterAll || noOpHook,
    beforeEach: groupDeclaration.beforeEach || noOpHook,
    afterEach: groupDeclaration.afterEach || noOpHook
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

var testSummaryDescription = function (file, testName, index) {
  return (testName ? '"' + testName + '" - ' : '') + 'test #' + (index + 1) + ' in `' + file + '`'
}
