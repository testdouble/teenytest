module.exports = {
  beforeAll: function(){ console.log("I run absolutely first") },
  beforeEach: function(){ console.log("I run before each test") },
  afterEach: function(){ console.log("I run right after each test") },
  afterAll: function(){ console.log("I run absolutely last") },
  options: {
    asyncTimeout: 100,
    asyncInterval: 1
  }
}
