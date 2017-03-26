module.exports = {
  beforePlusAfter: {
    beforeEach: function () { throw new Error('A') },
    test: function () { throw new Error('B') },
    afterEach: function () { throw new Error('C') }
  },
  afterRuinsIt: {
    foo: {
      test: function () {}
    },
    afterEach: function () { throw new Error('D') }
  },
  testPlusAfter: {
    test: function () { throw new Error('E') },
    afterEach: function () { throw new Error('F') }
  }
}
