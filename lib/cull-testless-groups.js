var _ = require('lodash')
var filterDeep = require('lodash-deeper').filterDeep

module.exports = function (testModules) {
  return cull({items: testModules}).items
}

function cull (exampleGroup) {
  return _.assign(exampleGroup, {
    items: _.reject(exampleGroup.items, function (item) {
      return item.__teenytest__type === 'group' &&
        filterDeep(cull(item), ['__teenytest__type', 'test']).length === 0
    })
  })
}
