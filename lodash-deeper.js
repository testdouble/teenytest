var _ = require('lodash')

module.exports = {
  filterDeep: function filterDeep (collection, predicate) {
    predicate = predicate || _.identity
    collection = { parent: collection }
    return deeplyFilters(collection, predicate, [])
  }
}

function deeplyFilters(collection, predicate, visited) {
  if (_.isObject(collection)) {
    return _.filter(collection, predicate).concat(_.flatMap(collection, function (val) {
      if(notYetTraversed(val, visited)) {
        return deeplyFilters(val, predicate, visited.concat(collection))
      } else {
        return []
      }
    }))
  } else {
    return []
  }
}

function notYetTraversed (val, visited) {
  return !_.some(visited, function (other) {
    return other === val
  })
}
