var modules = require('./modules')
var helper = require('./helper')

module.exports = function (config) {
  return {
    helper: helper(config.helperPath, config.cwd),
    modules: modules(config.criteria, config.cwd)
  }
}
