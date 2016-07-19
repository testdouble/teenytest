var _ = require('lodash/core')
var filterDeep = require('lodash-deeper/lodash-core').filterDeep

module.exports = function (testModules) {
  return cull({items: testModules}).items
}

function cull (exampleGroup) {
  return _.assignIn(exampleGroup, {
    items: reject(exampleGroup.items, function (item) {
      return item.type === 'suite' && holdsNoTests(item)
    })
  })
}

function holdsNoTests (item) {
  return filterDeep(cull(item), function (nestedItem) {
    return nestedItem.type === 'test'
  }).length === 0
}

function reject (list, cb) {
  return _.filter(list, function (item) {
    return !cb(item)
  })
}
