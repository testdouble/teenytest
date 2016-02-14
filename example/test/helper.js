module.exports = {
  beforeAll: function(){ "I run absolutely first" },
  beforeEach: function(){ "I run before each test" },
  afterEach: function(){ "I run right after each test" },
  afterAll: function(){ "I run absolutely last" },
  options: {
    asyncTimeout: 100,
    asyncInterval: 1
  }
}
