let i = 0
module.exports = {
  name: 'counter',
  analyzers: {
    userFunction: function (runUserFunction, metadata, cb) {
      runUserFunction(function (er) {
        cb(er, ++i)
      })
    }
  }
}
