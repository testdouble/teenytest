var _ = require('lodash')
global.__results = {}

// This is a dye test to verify that all the expected hooks ran (or didn't)
module.exports = {
  happy: {
    beforeAll: mark('happy.beforeAll'),
    beforeEach: mark('happy.beforeEach'),
    test: mark('happy.test'),
    afterEach: mark('happy.afterEach'),
    afterAll: mark('happy.afterAll')
  },
  beforeAllFails: {
    nest: {
      beforeAll: mark('beforeAllFails.nest.beforeAll'),
      beforeEach: mark('beforeAllFails.nest.beforeEach'),
      test: mark('beforeAllFails.nest.test'),
      afterEach: mark('beforeAllFails.nest.afterEach'),
      afterAll: mark('beforeAllFails.nest.afterAll')
    },
    beforeAll: fail('beforeAllFails.beforeAll'),
    beforeEach: mark('beforeAllFails.beforeEach'),
    test: mark('beforeAllFails.test'),
    afterEach: mark('beforeAllFails.afterEach'),
    afterAll: mark('beforeAllFails.afterAll')
  }
}

function mark (path) {
  _.set(global.__results, path, false)
  return function () {
    _.set(global.__results, path, true)
  }
}

function fail (path) {
  _.set(global.__results, path, false)
  return function () {
    _.set(global.__results, path, 'fail')
    throw new Error('Intentional failure at ' + path)
  }
}
