const loadModules = require('./modules')
const loadHelper = require('./helper')

module.exports = async function (config) {
  const [helper, modules] = await Promise.all([
    loadHelper(config.helperPath, config.cwd),
    loadModules(config.criteria, config.cwd)
  ])
  return { helper, modules }
}
