var filterDeep = require('lodash-deeper/lodash-core').filterDeep

module.exports = function (exampleGroups) {
  return filterDeep(exampleGroups, function (group) {
    return group && group.type === 'test'
  }).length
}
