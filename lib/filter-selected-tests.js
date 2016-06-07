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

function filterTestFunctionsByNames (exampleGroup, names) {
  return _.assign({}, exampleGroup, {
    items: _.filter(exampleGroup.items, function (item) {
      return _.includes(names, item.name)
    })
  })
}

function hasNamedTestFunctions (testModule) {
  return _.some(testModule.items, 'name') // TODO: will need deep support
}
