var _ = require('lodash')
var assert = require('assert')

module.exports = function () {
  var log = []

  return {
    write: function () {
      log.push(_(arguments).toArray().join(' '))
    },
    read: function () { return log },
    toString: function () { return log.join('\n') },
    assert: function () {
      var lines = _.toArray(arguments)

      _.each(lines, function (line, i) {
        if (line instanceof RegExp) {
          assert(line.test(log[i]), line.toString() + ' did not match: "' + log[i] + '"')
        } else {
          assert.equal(log[i], line)
        }
      })
    }
  }
}
