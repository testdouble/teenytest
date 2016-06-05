var glob = require('glob')
var path = require('path')
var _ = require('lodash')
var fs = require('fs')
var functionNamesAtLine = require('function-names-at-line')

function noOpHook () {}

module.exports = function (locator, cwd) {
  var command = {
    cwd: cwd,
    criteria: criteriaFor(locator)
  }

  return _.map(glob.sync(command.criteria.glob), function (file) {
    var testPath = path.resolve(command.cwd, file)
    var testModule = require(testPath)

    return buildExampleGroup('module', testModule, command, file)
  })
}

function buildExampleGroup (name, groupDeclaration, command, file) {
  var testFuncs = selectedTestFunctionsIn(groupDeclaration, command, file)
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

var selectedTestFunctionsIn = function (testModule, command, file) {
  var testFunctions = testFunctionsIn(testModule)
  if (command.criteria.name) {
    return filterTestFunctionsByNames(testFunctions, [command.criteria.name])
  } else if (command.criteria.lineNumber && _.isPlainObject(testModule)) {
    var source = fs.readFileSync(path.resolve(command.cwd, file)).toString()
    var names = functionNamesAtLine(source, command.criteria.lineNumber)
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
