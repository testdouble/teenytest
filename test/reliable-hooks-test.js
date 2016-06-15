var helper = require('./support/helper')

module.exports = function (cb) {
  helper.run('test/fixtures/reliable-hooks.js', function (er, result, log) {
    helper.deepEqual(global.__results.happy, {
      beforeAll: true,
      beforeEach: true,
      test: true,
      afterEach: true,
      afterAll: true
    })

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

    delete global.__results
    cb(er)
  })
}

