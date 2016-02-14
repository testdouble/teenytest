var assert = require('assert')

module.exports = {
  beforeAll: function () { 'I\'ll run once before both tests' },
  beforeEach: function () { 'I\'ll run twice - once before each test' },

  adds: function () { assert.equal(1 + 1, 2) },
  subtracts: function () { assert.equal(4 - 2, 2) },

  afterEach: function () { 'I\'ll run twice - once after each test' },
  afterAll: function () { 'I\'ll run once after both tests' }
}
