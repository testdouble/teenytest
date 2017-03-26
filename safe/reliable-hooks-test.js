var helper = require('./support/helper')

module.exports = function (cb) {
  helper.run('safe/fixtures/reliable-hooks.js', function (er, result, log) {
    // Without failure, it all runs (ofc)
    helper.deepEqual(global.__results.happy, {
      beforeAll: true,
      beforeEach: true,
      test: true,
      afterEach: true,
      afterAll: true
    })

    // If a beforeAll fails, only sibling afterAll runs, everything else stops
    helper.deepEqual(global.__results.beforeAllFails, {
      beforeAll: 'fail',
      beforeEach: false,
      test: false,
      afterEach: false,
      afterAll: true,
      nest: {
        beforeAll: false,
        beforeEach: false,
        test: false,
        afterEach: false,
        afterAll: false
      }
    })

    // If a beforeEach fails only sibling afterEach runs (the *Alls already ran)
    helper.deepEqual(global.__results.beforeEachFails, {
      beforeAll: true,
      beforeEach: 'fail',
      test: false,
      test2: false,
      afterEach: true,
      afterAll: true,
      nest: {
        beforeAll: true,
        beforeEach: false,
        test: false,
        afterEach: false,
        afterAll: true
      }
    })

    // If a test fails, everything else runs
    helper.deepEqual(global.__results.testFails, {
      beforeAll: true,
      beforeEach: true,
      test: 'fail',
      afterEach: true,
      afterAll: true
    })

    delete global.__results
    cb(er)
  })
}

