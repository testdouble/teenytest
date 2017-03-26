var load = require('./load')
var filter = require('./filter')
var compact = require('./compact')

module.exports = function (criteria, cwd) {
  return compact(
    filter(
      load(criteria.glob, cwd),
      criteria,
      cwd
    )
  )
}
