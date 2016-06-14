var waiter = function (ms) {
  return function (cb) {
    setTimeout(function () { cb(null) }, ms)
  }
}

// Run this with a 100ms test timeout
module.exports = {
  beforeEach: waiter(20),
  tooSlow: {
    beforeEach: waiter(80),
    test1: waiter(80),
    afterEach: waiter(80)
  },
  fastEnough: {
    beforeEach: waiter(10),
    test2: waiter(20),
    test3: function () {},
    test4: waiter(50),
    afterEach: function () {}
  }
}


