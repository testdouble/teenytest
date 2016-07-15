var filterDeep = require('../lodash-deeper-core').filterDeep

module.exports = function (exampleGroups) {
  return filterDeep(exampleGroups, function (group) {
    return group && group.type === 'test'
  }).length
}
