module.exports = {
  name: 'result',
  translators: {
    userFunction: function (runUserFunction, metadata, cb) {
      runUserFunction(function (er, result) {
        if (metadata.subType === 'test') {
          cb(er, 'Result: ' + result.value)
        } else {
          cb(er)
        }
      })
    }
  }
}
