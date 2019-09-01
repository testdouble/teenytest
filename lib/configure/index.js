var _ = require('lodash')
var criteria = require('./criteria')
var defaults = require('./defaults')

module.exports = function (testLocator, userOptions) {
  return _.tap(_.defaults({}, userOptions, defaults()), function (config) {
    config.criteria = criteria(testLocator || config.testLocator, userOptions)
  })
}
