var filterDeep = require('lodash-deeper').filterDeep

module.exports = function (exampleGroups) {
  return filterDeep(exampleGroups, ['__teenytest__type', 'test']).length
}
