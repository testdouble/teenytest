var _ = require('lodash')
var functionNamesAtLine = require('function-names-at-line')
var fs = require('fs')
var path = require('path')

module.exports = function (testModules, criteria, cwd) {
  return _.map(testModules, function (testModule) {
    if (criteria.name) {
      return filterTestFunctionsByNames(testModule, [criteria.name])
    } else if (criteria.lineNumber && hasNamedTestFunctions(testModule)) {
      var source = fs.readFileSync(path.resolve(cwd, testModule.file)).toString()
      var names = functionNamesAtLine(source, criteria.lineNumber)
      return filterTestFunctionsByNames(testModule, names)
    } else {
      return testModule
    }
  })
}

function filterTestFunctionsByNames (testModule, testNames) {
  return _.assign({}, testModule, {
    items: _.filter(testModule.items, function (testFunction) {
      return _.includes(testNames, testFunction.testName)
    })
  })
}

function hasNamedTestFunctions (testModule) {
  return _.some(testModule.items, 'testName')
}
