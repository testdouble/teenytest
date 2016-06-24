module.exports = {
  beforeEach: function () {
    throw new Error('Bad hook do not run!')
  },
  thisIsNotOk: function () {}
}
