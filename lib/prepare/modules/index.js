var load = require('./load')
var filter = require('./filter')
var compact = require('./compact')
var _ = require('lodash')

module.exports = function (criteria, cwd) {
  return compact(_.flatten(_.map(criteria.testFiles, function (fileCriteria) {
    return filter(
      load(fileCriteria.file, cwd),
      fileCriteria,
      cwd
    )
  })))
}
