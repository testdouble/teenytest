var _ = require('lodash')
var assert = require('assert')

module.exports = {
  beforeEach: function(done) {
    _.defer(function(){
      this.secret = 'panda'
      done()
    })
  },
  aTest: function(done) {
    _.defer(function(){
      assert.equal(this.secret, 'panda')
        console.log('hiiii')
      done()
    })
  }
}
