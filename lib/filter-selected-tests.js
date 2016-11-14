var _assign = require('lodash/assign')
var _includes = require('lodash/includes')
var _map = require('lodash/map')
var _some = require('lodash/some')
var _transform = require('lodash/transform')

var functionNamesAtLine = require('function-names-at-line')
var fs = require('fs')
var path = require('path')

module.exports = function (testModules, criteria, cwd) {
  return _map(testModules, function (testModule) {
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
  return _assign({}, exampleGroup, {
    items: _transform(exampleGroup.items, function (memo, item) {
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
  return _some(names, function (n) {
    return _includes(item.ancestorNames.concat(item.name).join(' '), n)
  })
}

function hasNamedTestFunctions (testModule) {
  return _some(testModule.items, 'name')
}
