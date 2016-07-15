var _ = require('lodash/core')
var filterDeep = require('../lodash-deeper-core').filterDeep

module.exports = function (testModules) {
  return cull({items: testModules}).items
}

function cull (exampleGroup) {
  return _.assignIn(exampleGroup, {
    items: _.filter(exampleGroup.items, function (item) {
      return !(
        item.type === 'suite' &&
        filterDeep(cull(item), function (nestedItem) {
          return nestedItem.type === 'test'
        }).length === 0
      )
    })
  })
}
