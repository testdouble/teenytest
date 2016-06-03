var glob = require('glob')
var path = require('path')
var _ = require('lodash')

module.exports = function (locator, cwd) {
  var currentTestOrdinal = 0
  var criteria = criteriaFor(locator)

  return _.map(glob.sync(criteria.glob), function (file) {
    var testModule = require(path.resolve(cwd, file))
    var tests = _.map(selectedTestFunctionsIn(testModule, criteria), function (testEntry, i) {
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

function criteriaFor (locator) {
  if (_.includes(locator, '#')) {
    var parts = locator.split('#')
    return {
      glob: parts[0],
      name: parts[1]
    }
  } else if (_.includes(locator, ':')) {
    var parts = locator.split(':')
    return {
      glob: parts[0],
      lineNumber: parts[1]
    }
  } else {
    return { glob: locator }
  }
}

var selectedTestFunctionsIn = function (testModule, criteria) {
  var testFunctions = testFunctionsIn(testModule)
  if (criteria.name) {
    return filterTestFunctionsByName(testFunctions, criteria.name)
  } else {
    return testFunctions
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

var filterTestFunctionsByName = function (testFunctions, testName) {
  return _.filter(testFunctions, function (testFunction) {
    return testFunction.testName === testName
  })
}

var testSummaryDescription = function (file, testName, index) {
  return (testName ? '"' + testName + '" - ' : '') + 'test #' + (index + 1) + ' in `' + file + '`'
}
