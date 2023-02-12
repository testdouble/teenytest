const _ = require('lodash')
const criteria = require('./criteria')
const defaults = require('./defaults')

module.exports = function (testLocator, userOptions) {
  return _.tap(_.defaults({}, userOptions, defaults()), function (config) {
    config.criteria = criteria(testLocator || config.testLocator, userOptions)
  })
}
