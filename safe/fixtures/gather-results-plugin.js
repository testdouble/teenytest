module.exports = {
  name: 'gather-results',
  translators: {
    userFunction: function (runUserFunction, metadata, cb) {
      runUserFunction(function (er, result) {
        if (metadata.subType === 'test') {
          global.__results.push(result)
        }
        cb(er)
      })
    }
  }
}
