var glob = require('glob')
var path = require('path')
var _ = require('lodash')
var fs = require('fs')
var functionNamesAtLine = require('function-names-at-line')

module.exports = function (locator, cwd) {
  var currentTestOrdinal = 0

  // TODO declaration nested b/c of that stupid counter.
  function buildExampleGroup (groupDeclaration, criteria, cwd, file) {
    var testFuncs = selectedTestFunctionsIn(groupDeclaration, criteria, cwd, file)
    var tests = _.map(testFuncs, function (testEntry, i) {
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
      name: 'module',
      beforeAll: groupDeclaration.beforeAll || function () {},
      afterAll: groupDeclaration.afterAll || function () {},
      beforeEach: groupDeclaration.beforeEach || function () {},
      afterEach: groupDeclaration.afterEach || function () {}
    }
  }


  var criteria = criteriaFor(locator)

  var testModules = _.map(glob.sync(criteria.glob), function (file) {
    var testPath = path.resolve(cwd, file)
    var testModule = require(testPath)

    return buildExampleGroup(testModule, criteria, cwd, file)
  })

  return {
    modules: testModules,
    count: currentTestOrdinal
  }
}

function criteriaFor (locator) {
  var parts
  if (_.includes(locator, '#')) {
    parts = locator.split('#')
    return {
      glob: parts[0],
      name: parts[1]
    }
  } else if (_.includes(locator, ':')) {
    parts = locator.split(':')
    return {
      glob: parts[0],
      lineNumber: parts[1]
    }
  } else {
    return {
      glob: locator
    }
  }
}

var selectedTestFunctionsIn = function (testModule, criteria, cwd, file) {
  var testFunctions = testFunctionsIn(testModule)
  if (criteria.name) {
    return filterTestFunctionsByNames(testFunctions, [criteria.name])
  } else if (criteria.lineNumber && _.isPlainObject(testModule)) {
    var source = fs.readFileSync(path.resolve(cwd, file)).toString()
    var names = functionNamesAtLine(source, criteria.lineNumber)
    return filterTestFunctionsByNames(testFunctions, names)
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

var filterTestFunctionsByNames = function (testFunctions, testNames) {
  return _.filter(testFunctions, function (testFunction) {
    return _.includes(testNames, testFunction.testName)
  })
}

var testSummaryDescription = function (file, testName, index) {
  return (testName ? '"' + testName + '" - ' : '') + 'test #' + (index + 1) + ' in `' + file + '`'
}
