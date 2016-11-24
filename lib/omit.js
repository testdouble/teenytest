var _ = require('lodash/core')

module.exports = function omit (object, omission) {
  var block = {}
  block[omission] = null
  var omittingObject = _.defaults(block, object)
  delete omittingObject[omission]
  return omittingObject
}
