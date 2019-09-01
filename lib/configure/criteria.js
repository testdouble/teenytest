var _ = require('lodash')
var glob = require('glob')

module.exports = function (testLocatorGlobs, userOptions) {
  if (!userOptions) { userOptions = {} }
  if (!_.isArray(testLocatorGlobs)) { testLocatorGlobs = [testLocatorGlobs] }

  // Break the test criteria suffixes apart from glob patterns
  var testCriteria = _.map(testLocatorGlobs, function (testLocatorGlob) {
    return globWithExpandedCriteria(testLocatorGlob)
  })

  // If we have global example name criteria, add it to the globs as though it
  // were provided for the glob. This allows us to eliminate duplicate names
  testCriteria = _.map(testCriteria, function (criteria) {
    return applyGlobalFilters(criteria, userOptions)
  })

  // Expand globs into files each with a copy of the glob criteria
  testCriteria = _.flatten(_.map(testCriteria, function (globWithCriteria) {
    return pathsWithCriteria(globWithCriteria)
  }))

  // Consolidate into single object per file paths with arrays of lines/names
  testCriteria = consolidatedPathsWithCriteria(testCriteria)

  return {
    testFiles: testCriteria
  }
}

function globWithExpandedCriteria (testLocatorGlob) {
  var parts
  if (_.includes(testLocatorGlob, '#')) {
    parts = testLocatorGlob.split('#')
    return {
      glob: parts[0],
      name: [parts[1]]
    }
  } else if (_.includes(testLocatorGlob, ':')) {
    parts = testLocatorGlob.split(':')
    return {
      glob: parts[0],
      lineNumber: [parts[1]]
    }
  } else {
    return {
      glob: testLocatorGlob
    }
  }
}

function applyGlobalFilters (criteria, userOptions) {
  if (userOptions.example) {
    var globalNames = _.flatten([userOptions.example])
    criteria = _.defaults(criteria, { name: [] })
    criteria.name = _.flatten([criteria.name, globalNames])
  }
  return criteria
}

function pathsWithCriteria (globWithCriteria) {
  return _.map(glob.sync(globWithCriteria.glob), function (file) {
    return _.defaults({ file: file }, _.pick(globWithCriteria, 'name', 'lineNumber'))
  })
}

function consolidatedPathsWithCriteria (testCriteria) {
  let criteriaGroups = _.values(_.groupBy(testCriteria, function (criteria) {
    return criteria.file
  }))

  var consolidated = _.map(criteriaGroups, function (group) {
    var filters = _.reduce(group, function (result, criteria) {
      result.lineNumber.push(criteria.lineNumber)
      result.name.push(criteria.name)
      return result
    }, { lineNumber: [], name: [] })

    filters.lineNumber = _.uniq(_.compact(_.flatten(filters.lineNumber))).sort()
    filters.name = _.uniq(_.compact(_.flatten(filters.name))).sort()

    return _.defaults({ file: group[0].file }, _.omitBy(filters, _.isEmpty))
  })

  return consolidated
}
