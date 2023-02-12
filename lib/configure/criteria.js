const _ = require('lodash')
const glob = require('glob')

module.exports = function (testLocators, userOptions) {
  userOptions = userOptions || {}
  testLocators = _.castArray(testLocators)
  const testCriteria = criteriaConsolidatedByPath(
    testCriteriaWithExpandedGlobs(
      testCriteriaWithGlobalNameFilterApplied(
        testCriteriaFromLocators(testLocators),
        userOptions.name
      )
    )
  )
  return {
    testFiles: testCriteria
  }
}

function criteriaConsolidatedByPath (testCriteria) {
  return _.map(criteriaGroupedByPath(testCriteria), function (group) {
    const filters = collectedFilters(group)
    return _.defaults({ file: group[0].file }, filters)
  })
}

function testCriteriaWithExpandedGlobs (testCriteria) {
  return _.flatMap(testCriteria, function (globCriterion) {
    return pathCriteria(globCriterion)
  })
}

function testCriteriaWithGlobalNameFilterApplied (testCriteria, userOptionsName) {
  return _.map(testCriteria, function (globCriterion) {
    return applyNameFilters(globCriterion, userOptionsName)
  })
}

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
  const customizer = function (objValue, srcValue) {
    return _.compact(_.concat(_.castArray(objValue), _.castArray(srcValue)))
  }
  return _.assignWith(criteria, { name: nameFilters }, customizer)
}

function pathCriteria (globCriterion) {
  const paths = glob.sync(globCriterion.glob)
  const filters = _.pick(globCriterion, 'name', 'lineNumber')
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
  const filters = _.reduce(testCriteria, function (result, criteria) {
    result.lineNumber.push(criteria.lineNumber)
    result.name.push(criteria.name)
    return result
  }, { lineNumber: [], name: [] })

  const lineFilters = _.uniq(_.compact(_.flatten(filters.lineNumber))).sort()
  const nameFilters = _.uniq(_.compact(_.flatten(filters.name))).sort()

  return _.omitBy({
    lineNumber: lineFilters,
    name: nameFilters
  }, _.isEmpty)
}
