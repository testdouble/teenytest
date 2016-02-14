var glob = require('glob')
var path = require('path')
var _ = require('lodash')

module.exports = function (testGlob, cwd) {
  var currentTestOrdinal = 0
  return _.map(glob.sync(testGlob), function (file) {
    var testModule = require(path.resolve(cwd, file))
    var tests = _.map(testFunctionsIn(testModule), function (testEntry, i) {
      currentTestOrdinal++

      return {
        testFunction: testEntry.testFunction,
        testName: testEntry.testName,
        context: Object.create(null),
        description: currentTestOrdinal + ' - ' + testSummaryDescription(file, testEntry.testName, i),
        file: file
      }
    })

    return {
      tests: tests,
      file: file,
      beforeAll: testModule.beforeAll || function () {},
      afterAll: testModule.afterAll || function () {},
      beforeEach: testModule.beforeEach || function () {},
      afterEach: testModule.afterEach || function () {}
    }
  })
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
