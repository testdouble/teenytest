var _ = require('lodash')
var minimist = require('minimist')

var teenytest = require('../../index')

module.exports = function () {
  var options = _.defaults(argv(), defaults())
  teenytest(options.testGlob, options, function (er, passing) {
    process.exit(!er && passing ? 0 : 1)
  })
}

function defaults () {
  return {
    testGlob: 'test/lib/**/*.js',
    helperPath: 'test/helper.js',
    asyncTimeout: 5000
  }
}

function argv () {
  var argv = minimist(process.argv.slice(2))

  return {
    testGlob: _.last(argv['_']),
    helperPath: argv['helper'],
    asyncTimeout: argv['timeout']
  }
}
