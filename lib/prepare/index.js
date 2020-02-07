var loadModules = require('./modules')
var loadHelper = require('./helper')

module.exports = async function (config) {
  const [helper, modules] = await Promise.all([
    loadHelper(config.helperPath, config.cwd),
    loadModules(config.criteria, config.cwd)
  ]);
  return { helper, modules }
}
