module.exports = function () {
  return {
    cwd: process.cwd(),
    output: console.log,
    testLocator: 'test/lib/**/*.js',
    example: [],
    helperPath: 'test/helper.js',
    asyncTimeout: 5000,
    configurator: null,
    plugins: []
  }
}
