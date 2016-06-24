module.exports = {
  name: 'other-printer',
  analyzers: {
    suite: function (runSuite, metadata, cb) {
      runSuite(function (er) {
        if (metadata.name === 'global') {
          console.log('Sweet suite!')
        }
        cb(er)
      })
    }
  }
}

