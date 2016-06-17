var _ = require('lodash')
var filterDeep = require('lodash-deeper').filterDeep

module.exports = function (testModules) {
  return cull({items: testModules}).items
}

function cull (exampleGroup) {
  return _.assign(exampleGroup, {
    items: _.reject(exampleGroup.items, function (item) {
      return item.type === 'suite' &&
        filterDeep(cull(item), ['type', 'test']).length === 0
    })
  })
}
