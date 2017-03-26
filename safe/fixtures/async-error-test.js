var _ = require('lodash')

module.exports = function (done) {
  _.defer(function () {
    done(new Error('Something bad'))
  })
}
