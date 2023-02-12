const glob = require('glob')
const path = require('path')
const _ = require('lodash')

function noOpHook () {}
const HOOK_NAMES = ['beforeEach', 'beforeAll', 'afterEach', 'afterAll']

module.exports = async function (globPattern, cwd) {
  return Promise.all(_.map(glob.sync(globPattern), async function (file) {
    const testPath = path.resolve(cwd, file)
    let testModule
    try {
      testModule = require(testPath)
    } catch (e) {
      if (e.code !== 'ERR_REQUIRE_ESM') throw e
      testModule = await import('file://' + testPath)
    }

    return buildExampleGroup(testPath, testModule, file, [{ name: 'global' }])
  }))
}

function buildExampleGroup (name, groupDeclaration, file, ancestors) {
  return _.tap({
    name,
    type: 'suite',
    file,
    beforeAll: groupDeclaration.beforeAll || noOpHook,
    afterAll: groupDeclaration.afterAll || noOpHook,
    beforeEach: groupDeclaration.beforeEach || noOpHook,
    afterEach: groupDeclaration.afterEach || noOpHook,
    ancestorNames: _.map(ancestors, 'name')
  }, function (exampleGroup) {
    _.assign(exampleGroup, {
      items: itemsIn(groupDeclaration, file, ancestors.concat(exampleGroup))
    })
  })
}

const itemsIn = function (groupDeclaration, file, ancestors) {
  if (_.isFunction(groupDeclaration)) {
    return [buildTest(groupDeclaration.name, groupDeclaration, file, ancestors)]
  } else {
    return _(groupDeclaration).map(function (item, name) {
      if (_.includes(HOOK_NAMES, name)) {
        return undefined
      } else if (_.isFunction(item)) {
        return buildTest(name, item, file, ancestors)
      } else if (_.isPlainObject(item)) {
        return buildExampleGroup(name, item, file, ancestors)
      } else {
        return undefined
      }
    }).compact().value()
  }
}

function buildTest (name, testFunction, file, ancestors) {
  return _.tap({
    name,
    type: 'test',
    testFunction,
    context: Object.create(null),
    file,
    ancestorNames: _.map(ancestors, 'name')
  }, function (test) {
    _.assign(test, {
      description: function (suiteOrdinal, fileOrdinal) {
        return testDescription(test, suiteOrdinal, fileOrdinal)
      }
    })
  })
}

function testDescription (test, suiteOrdinal, fileOrdinal) {
  const fullName = _.drop(test.ancestorNames, 2).concat(test.name).join(' ')
  return suiteOrdinal + ' - ' +
         (fullName ? '"' + fullName + '" - ' : '') +
         'test #' + fileOrdinal +
         ' in `' + test.file + '`'
}
