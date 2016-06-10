var assert = require('assert')

module.exports = {
  ignoreThis: function (done) {
    done(new Error('Ignore me!'))
  },
  xMyTest: function () {
    throw new Error('No!')
  },
  uhIgnoreMe: {
    beforeEach: function (done) {
      setTimeout(function () {
        done(new Error('Bad hook do not run!'))
      }, 5)
    },
    andMe: function () {}
  },
  explosionPending: function () {
    throw new Error('KABOOM')
  },
  pendingButDone: function () {
    assert.equal(4, 2 + 2)
  }
}
