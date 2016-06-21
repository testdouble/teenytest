module.exports = function () {
  return {
    name: 'printer',
    analyzers: {
      suite: function (runSuite, metadata, cb) {
        runSuite(function (er) {
          console.log('Sweet suite!')
          cb(er)
        })
      }
    }
  }
}

