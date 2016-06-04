global.__results

module.exports = {
  beforeAll: function () { global.__results = []; global.__results.push('A') },
  beforeEach: function () { global.__results.push('B') },
  test1: function () { global.__results.push('C') },
  sub: {
    beforeAll: function () { global.__results.push('D') },
    beforeEach: function () { global.__results.push('E') },
    test2: function () { global.__results.push('F') },
    test3: function () { global.__results.push('G') },
    afterEach: function () { global.__results.push('H') },
    afterAll: function () { global.__results.push('I') }
  },
  afterEach: function () { global.__results.push('J') },
  afterAll: function () { global.__results.push('K'); console.log(global.__results) }
}
