var _ = require('lodash')
var glob = require('glob')

module.exports = function (testLocators, userOptions) {
  userOptions = userOptions || {}
  testLocators = _.castArray(testLocators)
  var testCriteria = criteriaConsolidatedByPath(
    testCriteriaWithExpandedGlobs(
      testCriteriaWithGlobalNameFilterApplied(
        testCriteriaFromLocators(testLocators),
        userOptions.example
      )
    )
  )
  return {
    testFiles: testCriteria
  }
}

// Consolidate criteria with duplicate file paths into a single criterion
// file paths with arrays of collected  line / name filter values
function criteriaConsolidatedByPath (testCriteria) {
  return _.map(criteriaGroupedByPath(testCriteria), function (group) {
    var filters = collectedFilters(group)
    return _.defaults({ file: group[0].file }, filters)
  })
}

// Expand globbed critera into criteria with file paths. Each resulting
// criterion receives a copy of the criteria associated to the glob.
function testCriteriaWithExpandedGlobs (testCriteria) {
  return _.flatMap(testCriteria, function (globCriterion) {
    return pathCriteria(globCriterion)
  })
}

// If we have global test name filters, add it to the criteria as though
// it were provided with each glob. This allows us to eliminate duplicate
// name filters in the collected criteria
function testCriteriaWithGlobalNameFilterApplied (testCriteria, userOptionsExample) {
  return _.map(testCriteria, function (globCriterion) {
    return applyNameFilters(globCriterion, userOptionsExample)
  })
}

// Break the test locator glob patterns apart from filter suffixes
// var testCriteria = breakTheTestLocatorGlobPatternsApartFromFilterSuffixes(testLocators)
function testCriteriaFromLocators (testLocators) {
  return _.map(testLocators, function (testLocator) {
    return globCriterion(testLocator)
  })
}

function globCriterion (testLocator) {
  return _.omitBy({
    glob: extractGlobFromTestLocator(testLocator),
    name: extractFilterSuffixFromTestLocator(testLocator, '#'),
    lineNumber: extractFilterSuffixFromTestLocator(testLocator, ':')
  }, _.isNull)
}

function extractGlobFromTestLocator (testLocator) {
  return testLocator.split('#')[0].split(':')[0]
}

function extractFilterSuffixFromTestLocator (testLocator, suffixSeperator) {
  if (!_.includes(testLocator, suffixSeperator)) { return null }
  return [testLocator.split(suffixSeperator)[1]]
}

function applyNameFilters (criteria, nameFilters) {
  if (!nameFilters) { return criteria }
  nameFilters = _.castArray(nameFilters)
  var customizer = function (objValue, srcValue) {
    return _.compact(_.concat(_.castArray(objValue), _.castArray(srcValue)))
  }
  return _.assignWith(criteria, { name: nameFilters }, customizer)
}

function pathCriteria (globCriterion) {
  var paths = glob.sync(globCriterion.glob)
  var filters = _.pick(globCriterion, 'name', 'lineNumber')
  return _.map(paths, function (path) {
    return _.assign({ file: path }, filters)
  })
}

function criteriaGroupedByPath (testCriteria) {
  return _.values(_.groupBy(testCriteria, function (criteria) {
    return criteria.file
  }))
}

function collectedFilters (testCriteria) {
  var filters = _.reduce(testCriteria, function (result, criteria) {
    result.lineNumber.push(criteria.lineNumber)
    result.name.push(criteria.name)
    return result
  }, { lineNumber: [], name: [] })

  var lineFilters = _.uniq(_.compact(_.flatten(filters.lineNumber))).sort()
  var nameFilters = _.uniq(_.compact(_.flatten(filters.name))).sort()

  return _.omitBy({
    lineNumber: lineFilters,
    name: nameFilters
  }, _.isEmpty)
}
