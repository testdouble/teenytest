module.exports = {
  translators: {
    userFunction: function (runUserFunction, metadata, cb) {
      runUserFunction(function (er, result) {
        if (metadata.subType === 'test') {
          global.__results.push('Result: ' + result.value)
        }
        cb(er)
      })
    }
  }
}
