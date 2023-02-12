const load = require('./load')
const filter = require('./filter')
const compact = require('./compact')
const _ = require('lodash')

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
