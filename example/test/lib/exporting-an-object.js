var assert = require('assert')

module.exports = {
  beforeAll: function() { console.log("I'll run once before both tests") },
  beforeEach: function() { console.log("I'll run twice before each test") },

  adds: function() { assert.equal(1 + 1, 2) },
  subtracts: function() { assert.equal(4 - 2, 2) },

  afterEach: function() { console.log("I'll run twice after each test") },
  afterAll: function() { console.log("I'll run once after both tests") }
}

