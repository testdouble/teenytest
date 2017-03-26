module.exports = {
  sync: function () {
    return 'stuff'
  },
  async: function (done) {
    done(null, 'other stuff')
  }
}
