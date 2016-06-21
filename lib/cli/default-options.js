module.exports = function () {
  return {
    output: console.log,
    testGlob: 'test/lib/**/*.js',
    helperPath: 'test/helper.js',
    asyncTimeout: 5000,
    plugins: []
  }
}
