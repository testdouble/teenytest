var _ = require('lodash/core')
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
  return _.assignIn({}, exampleGroup, {
    items: _.reduce(exampleGroup.items, function (memo, item) {
      if (itemPlusAncestorsMatchesAnyNames(item, names)) {
        memo.push(item)
      } else if (item.type === 'suite') {
        memo.push(filterTestFunctionsByNames(item, names))
      }
      return memo
    }, [])
  })
}

function itemPlusAncestorsMatchesAnyNames (item, names) {
  return _.some(names, function (n) {
    return item.ancestorNames.concat(item.name).join(' ').indexOf(n) > -1
  })
}

function hasNamedTestFunctions (testModule) {
  return _.some(testModule.items, 'name')
}
