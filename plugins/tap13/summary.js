function Summary () {
  this.total = 0
  this.passed = 0
  this.failed = 0
  this.skipped = 0
  this.failures = [] // {errors, locator}
}
module.exports = Summary

Summary.prototype.logTest = function (metadata, result) {
  this.total++
  if (result.passing) {
    this.passed++
  } else {
    this.failed++
    this.failures.push({
      description: metadata.description,
      errors: result.errors,
      setUpFailed: result.setUpFailed || result.skipped
      //^ skipped is a misnomer. Right now only ever used if a beforeEach/all fails :-/
    })
  }
}
