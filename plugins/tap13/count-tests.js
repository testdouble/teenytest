const filterDeep = require('lodash-deeper').filterDeep

module.exports = function (exampleGroups) {
  return filterDeep(exampleGroups, ['type', 'test']).length
}
