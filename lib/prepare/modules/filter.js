const _ = require('lodash')
const functionNamesAtLine = require('function-names-at-line')
const fs = require('fs')
const path = require('path')

module.exports = function (testModules, criteria, cwd) {
  return _.map(testModules, function (testModule) {
    if (criteria.name) {
      return filterTestFunctionsByNames(testModule, [criteria.name])
    } else if (criteria.lineNumber && hasNamedTestFunctions(testModule)) {
      const source = fs.readFileSync(path.resolve(cwd, testModule.file)).toString()
      const names = _.compact(_.flatMap(criteria.lineNumber, function (lineNumber) {
        return functionNamesAtLine(source, lineNumber)
      }))
      return filterTestFunctionsByNames(testModule, names)
    } else {
      return testModule
    }
  })
}

function filterTestFunctionsByNames (exampleGroup, names) {
  names = _.flatten(names)
  return _.assign({}, exampleGroup, {
    items: _.transform(exampleGroup.items, function (memo, item) {
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
    return _.includes(item.ancestorNames.concat(item.name).join(' '), n)
  })
}

function hasNamedTestFunctions (testModule) {
  return _.some(testModule.items, 'name')
}
