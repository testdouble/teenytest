var assert = require('assert')

module.exports = {
  ignoreThis: function (done) {
    done(new Error('Ignore me!'))
  },
  ignoreMyTest: function () {
    throw new Error('No!')
  },
  ignoreMySuite: {
    beforeEach: function (done) {
      setTimeout(function () {
        done(new Error('Bad hook do not run!'))
      }, 5)
    },
    andMe: function () {}
  },
  pendingExplosion: function () {
    throw new Error('KABOOM')
  },
  pendingButDone: function () {
    assert.equal(4, 2 + 2)
  }
}
