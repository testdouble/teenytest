var _assign = require('lodash/assign')
var _reject = require('lodash/reject')

var filterDeep = require('lodash-deeper').filterDeep

module.exports = function (testModules) {
  return cull({items: testModules}).items
}

function cull (exampleGroup) {
  return _assign(exampleGroup, {
    items: _reject(exampleGroup.items, function (item) {
      return item.type === 'suite' &&
        filterDeep(cull(item), ['type', 'test']).length === 0
    })
  })
}
