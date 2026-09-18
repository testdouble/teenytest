const _ = require('lodash')
const assert = require('assert')

module.exports = function (done) {
  _.defer(function () {
    assert.equal(98, 42)
    done()
  })
}
