var _ = require('lodash')
var async = require('async')

module.exports = function (actions, wrapper, cb) {
  var results = {
    overallPassing: true,
    nestedPassing: [true]
  }
  async.series(asyncifyCollections(actions, wrapper, results), function (e) {
    if (e) { return cb(e, false) }
    cb(null, results.overallPassing)
  })
}

var asyncifyCollections = function (actions, wrapper, results) {
  return _.map(actions, function (action) {
    if (_.isFunction(action.callable)) {
      return wrapper(action, results)
    } else if (_.isArray(action)) {
      return function (cb) {
        async.series(asyncifyCollections(action, wrapper, appendNestedResult(results)), function (er) {
          results.nestedPassing.pop()
          cb(er)
        })
      }
    } else {
      throw new Error('Test actions must be either functions or arrays.')
    }
  })
}

var appendNestedResult = function (results) {
  results.nestedPassing.push(true)
  return results
}
