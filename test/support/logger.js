var _ = require('lodash')

var log = []
module.exports = function logger(){
  log.push(_(arguments).toArray().join(' '))
}

module.exports.read = function() { return log }
module.exports.reset = function(){ log = [] }
