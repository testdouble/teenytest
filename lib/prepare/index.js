var modules = require('./modules')
var helper = require('./helper')

module.exports = function (config) {
  return {
    modules: modules(config.criteria, config.cwd),
    helper: helper(config.helperPath, config.cwd)
  }
}
