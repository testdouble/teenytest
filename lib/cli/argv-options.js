const _ = require('lodash')
const minimist = require('minimist')

module.exports = function () {
  const argv = minimist(process.argv.slice(2))
  return {
    testLocator: _.isEmpty(argv._) ? undefined : _.castArray(argv._),
    name: argv.name,
    helperPath: argv.helper,
    asyncTimeout: argv.timeout,
    configurator: argv.configurator,
    plugins: argv.plugin ? _.castArray(argv.plugin) : undefined
  }
}
