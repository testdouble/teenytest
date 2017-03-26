var _ = require('lodash')

module.exports = function (locator) {
  var parts
  if (_.includes(locator, '#')) {
    parts = locator.split('#')
    return {
      glob: parts[0],
      name: parts[1]
    }
  } else if (_.includes(locator, ':')) {
    parts = locator.split(':')
    return {
      glob: parts[0],
      lineNumber: parts[1]
    }
  } else {
    return {
      glob: locator
    }
  }
}
