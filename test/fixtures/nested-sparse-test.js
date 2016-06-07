module.exports = {
  a: {
    b: {
      c: {
        d: {
          e: {
            woot: function () {}
          },
          doh: function () { throw new Error('Doh') }
        }
      },
      z: {
        beforeAll: function () { throw new Error('z1') },
        beforeEach: function () { throw new Error('z2') },
        afterEach: function () { throw new Error('z3') },
        afterAll: function () { throw new Error('z4') }
      }
    }
  }
}
