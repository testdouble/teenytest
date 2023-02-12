const subject = require('../../../../plugins/tap13/count-tests')

module.exports = {
  "counts the number of deeply nested things with 'type' test": function () {
    const result = subject([
      { type: 'test' },
      { type: 'other thing' },
      {
        stuff: [
          { type: 'nooooo' },
          { type: 'test' }
        ]
      }
    ])

    assert.equal(result, 2)
  }
}
