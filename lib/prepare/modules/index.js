var load = require('./load')
var filter = require('./filter')
var compact = require('./compact')
var _ = require('lodash')

module.exports = async function (criteria, cwd) {
  const loadedFiles = await Promise.all(_.map(criteria.testFiles, async function (fileCriteria) {
    return filter(
      await load(fileCriteria.file, cwd),
      fileCriteria,
      cwd
    )
  }))
  return compact(_.compact(_.flatten(loadedFiles)))
}
